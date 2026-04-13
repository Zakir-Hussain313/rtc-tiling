'use client';

import { useState, useRef, useEffect } from 'react';
import { Service, generateServiceSlug } from './ServicesEditor';
import '@/styles/Admin/Services/ServiceFormModal.css';

interface ServiceFormModalProps {
    service: Service | null;
    onSave: (data: Omit<Service, 'id'>) => void;
    onClose: () => void;
}

export default function ServiceFormModal({ service, onSave, onClose }: ServiceFormModalProps) {
    const [title, setTitle] = useState(service?.title ?? '');
    const [description, setDescription] = useState(service?.description ?? '');
    const [image, setImage] = useState<string | null>(service?.image ?? null);
    const [imageName, setImageName] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    function handleImage(file: File) {
        if (!file.type.startsWith('image/')) return;
        setImageName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => setImage(e.target?.result as string);
        reader.readAsDataURL(file);
    }

    function handleSubmit() {
        if (!title.trim()) return;
        onSave({ title, description, image });
    }

    return (
        <div className="svcModalOverlay" onClick={onClose}>
            <div className="svcModalBox" onClick={(e) => e.stopPropagation()}>

                <div className="svcModalHeader">
                    <h2 className="svcModalTitle">
                        {service ? 'Edit Service' : 'Add Service'}
                    </h2>
                    <button className="svcModalCloseBtn" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="svcModalBody">

                    {/* Image upload */}
                    <div className="svcModalField">
                        <label className="svcModalLabel">Service Image</label>
                        <div
                            className={`svcModalDropzone ${image ? 'hasImage' : ''}`}
                            onClick={() => inputRef.current?.click()}
                        >
                            {image ? (
                                <>
                                    <img src={image} alt="preview" className="svcModalImagePreview" />
                                    <div className="svcModalDropzoneOverlay">Click to replace</div>
                                </>
                            ) : (
                                <div className="svcModalDropzoneInner">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="16 16 12 12 8 16" />
                                        <line x1="12" y1="12" x2="12" y2="21" />
                                        <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
                                    </svg>
                                    <span>Click to upload image</span>
                                </div>
                            )}
                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImage(file);
                                }}
                            />
                        </div>
                        {imageName && <p className="svcModalImageName">{imageName}</p>}
                    </div>

                    {/* Title */}
                    <div className="svcModalField">
                        <label className="svcModalLabel" htmlFor="svc-title">Title</label>
                        <input
                            id="svc-title"
                            type="text"
                            className="svcModalInput"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Floor Tiling"
                        />
                        {title.trim() && (
                            <div className="svcModalSlugPreview">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                                </svg>
                                {generateServiceSlug(title)}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="svcModalField">
                        <label className="svcModalLabel" htmlFor="svc-desc">Description</label>
                        <textarea
                            id="svc-desc"
                            className="svcModalTextarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Short description of the service..."
                            rows={4}
                        />
                    </div>

                </div>

                <div className="svcModalFooter">
                    <button className="svcModalBtnGhost" onClick={onClose}>Cancel</button>
                    <button className="svcModalBtnPrimary" onClick={handleSubmit}>
                        {service ? 'Save Changes' : 'Add Service'}
                    </button>
                </div>

            </div>
        </div>
    );
}