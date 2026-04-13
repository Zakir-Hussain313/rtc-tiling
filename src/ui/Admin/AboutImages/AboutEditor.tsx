'use client';

import { useState, useRef } from 'react';
import '@/styles/Admin/AboutImages/AboutEditor.css';

type ImageSlot = {
    id: number;
    label: string;
    preview: string | null;
    fileName: string | null;
};

const initialSlots: ImageSlot[] = [
    { id: 1, label: 'Image 1', preview: null, fileName: null },
    { id: 2, label: 'Image 2', preview: null, fileName: null },
    { id: 3, label: 'Image 3', preview: null, fileName: null },
    { id: 4, label: 'Image 4', preview: null, fileName: null },
];

export default function AboutEditor() {
    const [slots, setSlots] = useState<ImageSlot[]>(initialSlots);
    const [saved, setSaved] = useState(false);

    function handleFile(id: number, file: File) {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            setSlots((prev) =>
                prev.map((s) =>
                    s.id === id
                        ? { ...s, preview: e.target?.result as string, fileName: file.name }
                        : s
                )
            );
        };
        reader.readAsDataURL(file);
        setSaved(false);
    }

    function handleSave() {
        // connect to your API here
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }

    return (
        <main className="aboutEditorBody">

            <div className="aboutEditorHeader">
                <div>
                    <div className="aboutEditorEyebrow">Editing</div>
                    <h1 className="aboutEditorHeading">About Page Images</h1>
                    <p className="aboutEditorSub">Upload or replace the four images displayed on your About page.</p>
                </div>
                <button
                    className={`aboutEditorBtnPrimary ${saved ? 'saved' : ''}`}
                    onClick={handleSave}
                >
                    {saved ? (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Saved!
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                                <polyline points="17 21 17 13 7 13 7 21" />
                                <polyline points="7 3 7 8 15 8" />
                            </svg>
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            <div className="aboutEditorGrid">
                {slots.map((slot) => (
                    <AboutImageSlot
                        key={slot.id}
                        slot={slot}
                        onFile={(file) => handleFile(slot.id, file)}
                    />
                ))}
            </div>

        </main>
    );
}

function AboutImageSlot({ slot, onFile }: { slot: ImageSlot; onFile: (file: File) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) onFile(file);
    }

    return (
        <div className="aboutImageSlot">
            <div className="aboutImageSlotHeader">
                <div className="aboutImageSlotIcon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                </div>
                <div>
                    <div className="aboutImageSlotLabel">{slot.label}</div>
                    <div className="aboutImageSlotHint">Recommended: 800 × 600px</div>
                </div>
            </div>

            <div
                className={`aboutDropzone ${dragging ? 'dragging' : ''} ${slot.preview ? 'hasImage' : ''}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
            >
                {slot.preview ? (
                    <>
                        <img src={slot.preview} alt={slot.label} className="aboutPreviewImg" />
                        <div className="aboutPreviewOverlay">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                            Click to replace
                        </div>
                    </>
                ) : (
                    <div className="aboutDropzoneInner">
                        <div className="aboutDropzoneIcon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="16 16 12 12 8 16" />
                                <line x1="12" y1="12" x2="12" y2="21" />
                                <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
                            </svg>
                        </div>
                        <p className="aboutDropzoneLabel">Drag & drop or <span>browse</span></p>
                        <p className="aboutDropzoneSub">PNG, JPG, WEBP — max 10MB</p>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onFile(file);
                    }}
                />
            </div>

            {slot.fileName && (
                <div className="aboutFileName">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                        <polyline points="13 2 13 9 20 9" />
                    </svg>
                    {slot.fileName}
                </div>
            )}
        </div>
    );
}