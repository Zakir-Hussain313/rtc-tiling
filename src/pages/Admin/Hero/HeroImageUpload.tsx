'use client';

import { useState, useRef } from 'react';
import '@/styles/Admin/Hero/HeroImageUpload.css';

export default function HeroImageUpload() {
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    function handleFile(file: File) {
        if (!file.type.startsWith('image/')) return;
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }

    return (
        <div className="heroUploadCard">
            <div className="heroUploadCardHeader">
                <div className="heroUploadCardIcon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                </div>
                <div>
                    <h3 className="heroUploadCardTitle">Background Image</h3>
                    <p className="heroUploadCardSub">Recommended size: 1920 × 1080px</p>
                </div>
            </div>

            <div
                className={`heroDropzone ${isDragging ? 'dragging' : ''} ${preview ? 'hasPreview' : ''}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                {preview ? (
                    <>
                        <img src={preview} alt="Hero preview" className="heroPreviewImg" />
                        <div className="heroPreviewOverlay">
                            <span className="heroPreviewOverlayText">Click to replace</span>
                        </div>
                    </>
                ) : (
                    <div className="heroDropzoneInner">
                        <div className="heroDropzoneIcon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="16 16 12 12 8 16" />
                                <line x1="12" y1="12" x2="12" y2="21" />
                                <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
                            </svg>
                        </div>
                        <p className="heroDropzoneLabel">Drag & drop or <span>browse</span></p>
                        <p className="heroDropzoneSub">PNG, JPG, WEBP — max 10MB</p>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="heroFileInput"
                    onChange={handleChange}
                />
            </div>

            {fileName && (
                <div className="heroFileName">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                        <polyline points="13 2 13 9 20 9" />
                    </svg>
                    {fileName}
                </div>
            )}
        </div>
    );
}