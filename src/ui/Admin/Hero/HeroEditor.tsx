'use client';

import { useState, useEffect } from 'react';
import HeroImageUpload from './HeroImageUpload';
import HeroTextFields from './HeroTextFields';
import HeroOverlay from './HeroOverlay';
import '@/styles/Admin/Hero/HeroEditor.css';
import { uploadToCloudinary } from 'lib/uploadToCloudinary';

type HeroData = {
    backgroundImage: string | null;
    backgroundImagePublicId: string | null;
    headline: string;
    subheading: string;
    overlayOpacity: number;
    _file: File | null;
};

const defaults: HeroData = {
    backgroundImage: null,
    backgroundImagePublicId: null,
    headline: '',
    subheading: '',
    overlayOpacity: 40,
    _file: null,
};

export default function HeroEditor() {
    const [data, setData] = useState<HeroData>(defaults);
    const [original, setOriginal] = useState<HeroData>(defaults);
    const [fetching, setFetching] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // ── Load existing hero data on mount
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch('/api/hero');
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();
                const d = json.data;

                const loaded: HeroData = {
                    backgroundImage: d?.backgroundImage ?? null,
                    backgroundImagePublicId: d?.backgroundImagePublicId ?? null,
                    headline: d?.headline ?? '',
                    subheading: d?.subheading ?? '',
                    overlayOpacity: d?.overlayOpacity ?? 40,
                    _file: null,
                };

                setData(loaded);
                setOriginal(loaded);
            } catch (err) {
                console.error('[HeroEditor] Failed to load', err);
            } finally {
                setFetching(false);
            }
        }
        load();
    }, []);

    function handleDiscard() {
        setData(original);
    }

    async function handleSave() {
        setSaving(true);
        try {
            const payload: Record<string, unknown> = {
                headline: data.headline,
                subheading: data.subheading,
                overlayOpacity: data.overlayOpacity,
            };

            // Upload new image directly to Cloudinary first
            if (data._file) {
                const { url, publicId } = await uploadToCloudinary(data._file, 'rtc/hero');
                payload.backgroundImage = url;
                payload.backgroundImagePublicId = publicId;
            }

            const res = await fetch('/api/hero', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to save');

            const json = await res.json();
            const updated: HeroData = {
                backgroundImage: json.data?.backgroundImage ?? null,
                backgroundImagePublicId: json.data?.backgroundImagePublicId ?? null,
                headline: json.data?.headline ?? '',
                subheading: json.data?.subheading ?? '',
                overlayOpacity: json.data?.overlayOpacity ?? 40,
                _file: null,
            };

            setData(updated);
            setOriginal(updated);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            console.error('[HeroEditor] Save failed', err);
            alert('Failed to save hero data.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="heroEditorBody">
            <div className="heroEditorHeader">
                <div>
                    <div className="heroEditorEyebrow">Editing</div>
                    <h1 className="heroEditorHeading">Hero Section</h1>
                    <p className="heroEditorSub">Changes here will update the hero section on your homepage.</p>
                </div>
                <div className="heroEditorHeaderActions">
                    <button
                        className="heroEditorBtnGhost"
                        onClick={handleDiscard}
                        disabled={fetching || saving}
                    >
                        Discard
                    </button>
                    <button
                        className="heroEditorBtnPrimary"
                        onClick={handleSave}
                        disabled={fetching || saving}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {fetching ? 'Loading...' : saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {fetching ? (
                <p style={{ padding: '2rem', opacity: 0.5 }}>Loading hero data…</p>
            ) : (
                <div className="heroEditorGrid">
                    <div className="heroEditorLeft">
                        <HeroImageUpload
                            value={data.backgroundImage}
                            onChange={(preview, file) => setData((prev) => ({ ...prev, backgroundImage: preview, _file: file }))}
                        />
                        <HeroOverlay
                            opacity={data.overlayOpacity}
                            onChange={(val) => setData((prev) => ({ ...prev, overlayOpacity: val }))}
                            backgroundImage={data.backgroundImage}
                        />
                    </div>
                    <div className="heroEditorRight">
                        <HeroTextFields
                            headline={data.headline}
                            onHeadlineChange={(val) => setData((prev) => ({ ...prev, headline: val }))}
                        />
                    </div>
                </div>
            )}
        </main>
    );
}