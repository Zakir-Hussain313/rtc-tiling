'use client';

import { useState, useRef, useEffect } from 'react';
import { Service, generateServiceSlug } from './ServicesEditor';
import '@/styles/Admin/Services/ServiceFormModal.css';

interface ServiceFormModalProps {
    service: Service | null;
    onSave: (data: Omit<Service, '_id' | 'slug'>) => void;
    onClose: () => void;
    saving: boolean;
}

export default function ServiceFormModal({ service, onSave, onClose, saving }: ServiceFormModalProps) {
    const [title,             setTitle]             = useState('');
    const [description,       setDescription]       = useState('');
    const [serviceType,       setServiceType]       = useState('');
    const [location,          setLocation]          = useState('');
    const [estimatedDuration, setEstimatedDuration] = useState('');
    const [maximumArea,       setMaximumArea]       = useState('');
    const [finishStyle,       setFinishStyle]       = useState('');
    const [suitableFor,       setSuitableFor]       = useState('');
    const [image,             setImage]             = useState<string | null>(null);
    const [imageName,         setImageName]         = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTitle            (service?.title             ?? '');
        setDescription      (service?.description       ?? '');
        setServiceType      (service?.serviceType       ?? '');
        setLocation         (service?.location          ?? '');
        setEstimatedDuration(service?.estimatedDuration ?? '');
        setMaximumArea      (service?.maximumArea       ?? '');
        setFinishStyle      (service?.finishStyle       ?? '');
        setSuitableFor      (service?.suitableFor       ?? '');
        setImage            (service?.image             ?? null);
        setImageName        (service?.image ? 'Current image' : null);
    }, [service]);

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
        if (!title.trim() || saving) return;
        onSave({
            title, description, serviceType, location,
            estimatedDuration, maximumArea, finishStyle,
            suitableFor, image,
        });
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

                    {/* Image */}
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

                    {/* Two-column grid */}
                    <div className="svcModalGrid">

                        <div className="svcModalField">
                            <label className="svcModalLabel" htmlFor="svc-type">Service Type</label>
                            <input
                                id="svc-type"
                                type="text"
                                className="svcModalInput"
                                value={serviceType}
                                onChange={(e) => setServiceType(e.target.value)}
                                placeholder="e.g. Residential"
                            />
                        </div>

                        <div className="svcModalField">
                            <label className="svcModalLabel" htmlFor="svc-location">Location</label>
                            <input
                                id="svc-location"
                                type="text"
                                className="svcModalInput"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. Dubai, UAE"
                            />
                        </div>

                        <div className="svcModalField">
                            <label className="svcModalLabel" htmlFor="svc-duration">Estimated Duration</label>
                            <input
                                id="svc-duration"
                                type="text"
                                className="svcModalInput"
                                value={estimatedDuration}
                                onChange={(e) => setEstimatedDuration(e.target.value)}
                                placeholder="e.g. 3–5 days"
                            />
                        </div>

                        <div className="svcModalField">
                            <label className="svcModalLabel" htmlFor="svc-area">Maximum Area</label>
                            <input
                                id="svc-area"
                                type="text"
                                className="svcModalInput"
                                value={maximumArea}
                                onChange={(e) => setMaximumArea(e.target.value)}
                                placeholder="e.g. 500 sqm"
                            />
                        </div>

                        <div className="svcModalField">
                            <label className="svcModalLabel" htmlFor="svc-finish">Finish & Style</label>
                            <input
                                id="svc-finish"
                                type="text"
                                className="svcModalInput"
                                value={finishStyle}
                                onChange={(e) => setFinishStyle(e.target.value)}
                                placeholder="e.g. Matte, Polished"
                            />
                        </div>

                        <div className="svcModalField">
                            <label className="svcModalLabel" htmlFor="svc-suitable">Suitable For</label>
                            <input
                                id="svc-suitable"
                                type="text"
                                className="svcModalInput"
                                value={suitableFor}
                                onChange={(e) => setSuitableFor(e.target.value)}
                                placeholder="e.g. Villas, Apartments"
                            />
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