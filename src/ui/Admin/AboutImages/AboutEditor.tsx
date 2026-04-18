'use client';

import { useState, useRef, useEffect } from 'react';
import '@/styles/Admin/AboutImages/AboutEditor.css';

type ImageSlot = {
    id: number;
    label: string;
    preview: string | null;
    fileName: string | null;
    existingUrl: string | null; // from DB
};

const initialSlots: ImageSlot[] = [
    { id: 1, label: 'Image 1', preview: null, fileName: null, existingUrl: null },
    { id: 2, label: 'Image 2', preview: null, fileName: null, existingUrl: null },
    { id: 3, label: 'Image 3', preview: null, fileName: null, existingUrl: null },
];

export default function AboutEditor() {
    const [slots, setSlots] = useState<ImageSlot[]>(initialSlots);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Load existing images from DB on mount
    useEffect(() => {
        async function loadImages() {
            try {
                const res = await fetch('/api/about');
                if (!res.ok) throw new Error('Failed to load');
                const json = await res.json();
                const dbImages: { id: number; url: string }[] = json.data?.images ?? [];

                setSlots((prev) =>
                    prev.map((slot) => {
                        const match = dbImages.find((img) => img.id === slot.id);
                        return match
                            ? { ...slot, existingUrl: match.url }
                            : slot;
                    })
                );
            } catch (err) {
                console.error('Failed to load about images', err);
            } finally {
                setFetching(false);
            }
        }

        loadImages();
    }, []);

    function handleFile(id: number, file: File) {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setSlots((prev) =>
                prev.map((s) =>
                    s.id === id
                        ? {
                              ...s,
                              preview: e.target?.result as string,
                              fileName: file.name,
                          }
                        : s
                )
            );
        };

        reader.readAsDataURL(file);
        setSaved(false);
    }

    async function handleSave() {
        // Only send slots that have a NEW preview (base64) — skip unchanged ones
        const changedSlots = slots.filter((s) => s.preview !== null);

        if (changedSlots.length === 0) {
            alert('No new images selected to save.');
            return;
        }

        try {
            setLoading(true);

            const payload = {
                images: changedSlots.map((s) => ({
                    id: s.id,
                    image: s.preview,
                })),
            };

            const res = await fetch('/api/about', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to save images');

            const json = await res.json();
            const dbImages: { id: number; url: string }[] = json.data?.images ?? [];

            // After save: clear previews, update existingUrl from DB response
            setSlots((prev) =>
                prev.map((slot) => {
                    const match = dbImages.find((img) => img.id === slot.id);
                    return {
                        ...slot,
                        preview: null,
                        fileName: null,
                        existingUrl: match?.url ?? slot.existingUrl,
                    };
                })
            );

            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            console.error(err);
            alert('Failed to save images');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="aboutEditorBody">
            <div className="aboutEditorHeader">
                <div>
                    <div className="aboutEditorEyebrow">Editing</div>
                    <h1 className="aboutEditorHeading">About Page Images</h1>
                    <p className="aboutEditorSub">
                        Upload or replace the three images displayed on your About page.
                    </p>
                </div>

                <button
                    className={`aboutEditorBtnPrimary ${saved ? 'saved' : ''}`}
                    onClick={handleSave}
                    disabled={loading || fetching}
                >
                    {fetching ? 'Loading...' : loading ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            {fetching ? (
                <p style={{ padding: '2rem', opacity: 0.5 }}>Loading current images…</p>
            ) : (
                <div className="aboutEditorGrid">
                    {slots.map((slot) => (
                        <AboutImageSlot
                            key={slot.id}
                            slot={slot}
                            onFile={(file) => handleFile(slot.id, file)}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}

function AboutImageSlot({
    slot,
    onFile,
}: {
    slot: ImageSlot;
    onFile: (file: File) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    // Show new upload preview first, then fall back to DB image
    const displaySrc = slot.preview ?? slot.existingUrl;

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) onFile(file);
    }

    return (
        <div className="aboutImageSlot">
            <div
                className={`aboutDropzone ${dragging ? 'dragging' : ''} ${
                    displaySrc ? 'hasImage' : ''
                }`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
            >
                {displaySrc ? (
                    <img
                        src={displaySrc}
                        alt={slot.label}
                        className="aboutPreviewImg"
                    />
                ) : (
                    <p>Drag & drop or click to upload</p>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onFile(file);
                    }}
                />
            </div>

            {slot.fileName && (
                <div className="aboutFileName">{slot.fileName}</div>
            )}

            {/* Show a badge if this slot already has a saved image */}
            {!slot.preview && slot.existingUrl && (
                <div className="aboutFileName" style={{ opacity: 0.5 }}>
                    Saved image loaded
                </div>
            )}
        </div>
    );
}