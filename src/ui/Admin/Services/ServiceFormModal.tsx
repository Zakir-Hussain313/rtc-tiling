'use client';

import { useState, useRef, useEffect } from 'react';
import { Service, generateServiceSlug } from './ServicesEditor';
import '@/styles/Admin/Services/ServiceFormModal.css';
import Image from 'next/image';

interface ServiceFormModalProps {
    service: Service | null;
    onSave: (data: any) => void;
    onClose: () => void;
    saving: boolean;
}

type ExistingImage = {
    url: string;
    publicId: string;
    toRemove: boolean;
};

type NewImage = {
    preview: string;
    base64: string;
    name: string;
};

export default function ServiceFormModal({ service, onSave, onClose, saving }: ServiceFormModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [location, setLocation] = useState('');
    const [estimatedDuration, setEstimatedDuration] = useState('');
    const [maximumArea, setMaximumArea] = useState('');
    const [finishStyle, setFinishStyle] = useState('');
    const [suitableFor, setSuitableFor] = useState('');
    const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
    const [newImages, setNewImages] = useState<NewImage[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTitle(service?.title ?? '');
        setDescription(service?.description ?? '');
        setServiceType(service?.serviceType ?? '');
        setLocation(service?.location ?? '');
        setEstimatedDuration(service?.estimatedDuration ?? '');
        setMaximumArea(service?.maximumArea ?? '');
        setFinishStyle(service?.finishStyle ?? '');
        setSuitableFor(service?.suitableFor ?? '');
        setNewImages([]);

        if (service?.images && service?.imagePublicIds) {
            setExistingImages(
                service.images.map((url, i) => ({
                    url,
                    publicId: service.imagePublicIds[i] ?? '',
                    toRemove: false,
                }))
            );
        } else {
            setExistingImages([]);
        }
    }, [service]);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    function handleFiles(files: FileList) {
        Array.from(files).forEach((file) => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                setNewImages((prev) => [
                    ...prev,
                    { preview: e.target?.result as string, base64: e.target?.result as string, name: file.name },
                ]);
            };
            reader.readAsDataURL(file);
        });
    }

    function toggleRemoveExisting(idx: number) {
        setExistingImages((prev) =>
            prev.map((img, i) => i === idx ? { ...img, toRemove: !img.toRemove } : img)
        );
    }

    function removeNewImage(idx: number) {
        setNewImages((prev) => prev.filter((_, i) => i !== idx));
    }

    function handleSubmit() {
        if (!title.trim() || saving) return;

        const removedPublicIds = existingImages
            .filter((img) => img.toRemove)
            .map((img) => img.publicId);

        const keptImages = existingImages
            .filter((img) => !img.toRemove)
            .map((img) => img.url);

        const keptPublicIds = existingImages
            .filter((img) => !img.toRemove)
            .map((img) => img.publicId);

        onSave({
            title,
            description,
            serviceType,
            location,
            estimatedDuration,
            maximumArea,
            finishStyle,
            suitableFor,
            images: newImages.map((img) => img.base64),
            imagePublicIds: keptPublicIds,
            removedPublicIds,
            keptImages,
        });
    }

    const totalImages = existingImages.filter(i => !i.toRemove).length + newImages.length;

    return (
        <div className="svcModalOverlay" onClick={onClose}>
            <div className="svcModalBox" onClick={(e) => e.stopPropagation()}>

                <div className="svcModalHeader">
                    <h2 className="svcModalTitle">{service ? 'Edit Service' : 'Add Service'}</h2>
                    <button className="svcModalCloseBtn" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="svcModalBody">

                    {/* Images */}
                    <div className="svcModalField">
                        <label className="svcModalLabel">
                            Service Images
                            <span className="svcModalLabelCount">{totalImages} image{totalImages !== 1 ? 's' : ''}</span>
                        </label>

                        {existingImages.length > 0 && (
                            <div className="svcModalImageGrid">
                                {existingImages.map((img, idx) => (
                                    <div key={idx} className={`svcModalImageThumb ${img.toRemove ? 'toRemove' : ''}`}>
                                        <Image src={img.url} alt={`Image ${idx + 1}`} fill style={{ objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            className="svcModalImageRemoveBtn"
                                            onClick={() => toggleRemoveExisting(idx)}
                                            title={img.toRemove ? 'Undo remove' : 'Remove'}
                                        >
                                            {img.toRemove ? (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0" />
                                                    <path d="M9 12l2 2 4-4" />
                                                </svg>
                                            ) : (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            )}
                                        </button>
                                        {img.toRemove && <div className="svcModalImageRemoveOverlay">Will be removed</div>}
                                    </div>
                                ))}
                            </div>
                        )}

                        {newImages.length > 0 && (
                            <div className="svcModalImageGrid">
                                {newImages.map((img, idx) => (
                                    <div key={idx} className="svcModalImageThumb isNew">
                                        <Image src={img.preview} alt={img.name} fill style={{ objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            className="svcModalImageRemoveBtn"
                                            onClick={() => removeNewImage(idx)}
                                            title="Remove"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                        <div className="svcModalImageNewBadge">New</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="svcModalDropzone" onClick={() => inputRef.current?.click()}>
                            <div className="svcModalDropzoneInner">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="16 16 12 12 8 16" />
                                    <line x1="12" y1="12" x2="12" y2="21" />
                                    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
                                </svg>
                                <span>Click to add images</span>
                                <span className="svcModalDropzoneHint">You can select multiple</span>
                            </div>
                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                                onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
                            />
                        </div>
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

                    {/* Grid fields */}
                    <div className="svcModalGrid">
                        <div className="svcModalField">
                            <label className="svcModalLabel" htmlFor="svc-type">Service Type</label>
                            <input id="svc-type" type="text" className="svcModalInput" value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="e.g. Residential" />
                        </div>
                        <div className="svcModalField">
                            <label className="svcModalLabel" htmlFor="svc-location">Location</label>
                            <input id="svc-location" type="text" className="svcModalInput" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Dubai, UAE" />
                        </div>
                        <div className="svcModalField">
                            <label className="svcModalLabel" htmlFor="svc-duration">Estimated Duration</label>
                            <input id="svc-duration" type="text" className="svcModalInput" value={estimatedDuration} onChange={(e) => setEstimatedDuration(e.target.value)} placeholder="e.g. 3–5 days" />
                        </div>
                        <div className="svcModalField">
                            <label className="svcModalLabel" htmlFor="svc-area">Maximum Area</label>
                            <input id="svc-area" type="text" className="svcModalInput" value={maximumArea} onChange={(e) => setMaximumArea(e.target.value)} placeholder="e.g. 500 sqm" />
                        </div>
                        <div className="svcModalField">
                            <label className="svcModalLabel" htmlFor="svc-finish">Finish & Style</label>
                            <input id="svc-finish" type="text" className="svcModalInput" value={finishStyle} onChange={(e) => setFinishStyle(e.target.value)} placeholder="e.g. Matte, Polished" />
                        </div>
                        <div className="svcModalField">
                            <label className="svcModalLabel" htmlFor="svc-suitable">Suitable For</label>
                            <input id="svc-suitable" type="text" className="svcModalInput" value={suitableFor} onChange={(e) => setSuitableFor(e.target.value)} placeholder="e.g. Villas, Apartments" />
                        </div>
                    </div>
                </div>

                <div className="svcModalFooter">
                    <button className="svcModalBtnGhost" onClick={onClose} disabled={saving}>Cancel</button>
                    <button className="svcModalBtnPrimary" onClick={handleSubmit} disabled={saving}>
                        {saving ? 'Saving...' : service ? 'Save Changes' : 'Add Service'}
                    </button>
                </div>
            </div>
        </div>
    );
}