'use client';

import { useState, useRef, useEffect } from 'react';
import { Project, generateSlug } from './ProjectsEditor';
import '@/styles/Admin/Projects/ProjectFormModal.css';

interface ProjectFormModalProps {
    project: Project | null;
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

const TODAY = new Date().toISOString().split('T')[0];

export default function ProjectFormModal({ project, onSave, onClose, saving }: ProjectFormModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [location, setLocation] = useState('');
    const [completionYear, setCompletionYear] = useState('');
    const [size, setSize] = useState('');
    const [designStyle, setDesignStyle] = useState('');
    const [client, setClient] = useState('');
    const [date, setDate] = useState('');
    const [dateError, setDateError] = useState('');
    const [featured, setFeatured] = useState(false);
    const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
    const [newImages, setNewImages] = useState<NewImage[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTitle(project?.title ?? '');
        setDescription(project?.description ?? '');
        setType(project?.type ?? '');
        setLocation(project?.location ?? '');
        setCompletionYear(project?.completionYear ?? '');
        setSize(project?.size ?? '');
        setDesignStyle(project?.designStyle ?? '');
        setClient(project?.client ?? '');
        setDate(project?.date ?? '');
        setFeatured(project?.featured ?? false);
        setDateError('');
        setNewImages([]);

        if (project?.images && project?.imagePublicIds) {
            setExistingImages(
                project.images.map((url, i) => ({
                    url,
                    publicId: project.imagePublicIds[i] ?? '',
                    toRemove: false,
                }))
            );
        } else {
            setExistingImages([]);
        }
    }, [project]);

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

    function validateDate(value: string): string {
        if (!value) return '';
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(value)) return 'Invalid date format.';
        const parsed = new Date(value);
        if (isNaN(parsed.getTime())) return 'Invalid date.';
        if (parsed.getFullYear() < 1900) return 'Date must be after 1900.';
        if (parsed > new Date(TODAY)) return 'Date cannot be in the future.';
        return '';
    }

    function handleDateChange(value: string) {
        setDate(value);
        setDateError(validateDate(value));
    }

    function handleSubmit() {
        if (!title.trim() || saving) return;

        const y = Number(completionYear);
        const currentYear = new Date().getFullYear();
        if (completionYear && (y < 1900 || y > currentYear + 5)) {
            alert('Enter a valid completion year');
            return;
        }

        const dateValidationError = validateDate(date);
        if (dateValidationError) {
            setDateError(dateValidationError);
            return;
        }

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
            type,
            location,
            completionYear,
            size,
            designStyle,
            client,
            date,
            featured,
            images: newImages.map((img) => img.base64),
            imagePublicIds: keptPublicIds,
            removedPublicIds,
            keptImages,
        } as any);
    }

    const totalImages = existingImages.filter(i => !i.toRemove).length + newImages.length;

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalBox" onClick={(e) => e.stopPropagation()}>

                <div className="modalHeader">
                    <h2 className="modalTitle">{project ? 'Edit Project' : 'Add Project'}</h2>
                    <button className="modalCloseBtn" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="modalBody">

                    {/* Images */}
                    <div className="modalField">
                        <label className="modalLabel">
                            Project Images
                            <span className="modalLabelCount">{totalImages} image{totalImages !== 1 ? 's' : ''}</span>
                        </label>

                        {/* Existing images */}
                        {existingImages.length > 0 && (
                            <div className="modalImageGrid">
                                {existingImages.map((img, idx) => (
                                    <div key={idx} className={`modalImageThumb ${img.toRemove ? 'toRemove' : ''}`}>
                                        <img src={img.url} alt={`Image ${idx + 1}`} />
                                        <button
                                            type="button"
                                            className="modalImageRemoveBtn"
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
                                        {img.toRemove && <div className="modalImageRemoveOverlay">Will be removed</div>}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* New images */}
                        {newImages.length > 0 && (
                            <div className="modalImageGrid">
                                {newImages.map((img, idx) => (
                                    <div key={idx} className="modalImageThumb isNew">
                                        <img src={img.preview} alt={img.name} />
                                        <button
                                            type="button"
                                            className="modalImageRemoveBtn"
                                            onClick={() => removeNewImage(idx)}
                                            title="Remove"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                        <div className="modalImageNewBadge">New</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload dropzone */}
                        <div
                            className="modalDropzone"
                            onClick={() => inputRef.current?.click()}
                        >
                            <div className="modalDropzoneInner">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="16 16 12 12 8 16" />
                                    <line x1="12" y1="12" x2="12" y2="21" />
                                    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
                                </svg>
                                <span>Click to add images</span>
                                <span className="modalDropzoneHint">You can select multiple</span>
                            </div>
                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    if (e.target.files) handleFiles(e.target.files);
                                }}
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="modalField">
                        <label className="modalLabel" htmlFor="proj-title">Title</label>
                        <input
                            id="proj-title"
                            type="text"
                            className="modalInput"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Pool Tiled"
                        />
                        {title.trim() && (
                            <div className="modalSlugPreview">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                                </svg>
                                {generateSlug(title)}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="modalField">
                        <label className="modalLabel" htmlFor="proj-desc">Description</label>
                        <textarea
                            id="proj-desc"
                            className="modalTextarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Short description of the project..."
                            rows={3}
                        />
                    </div>

                    {/* Grid fields */}
                    <div className="modalGrid">
                        <div className="modalField">
                            <label className="modalLabel" htmlFor="proj-type">Type</label>
                            <input id="proj-type" type="text" className="modalInput" value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. Residential" />
                        </div>
                        <div className="modalField">
                            <label className="modalLabel" htmlFor="proj-location">Location</label>
                            <input id="proj-location" type="text" className="modalInput" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Dubai, UAE" />
                        </div>
                        <div className="modalField">
                            <label className="modalLabel" htmlFor="proj-year">Completion Year</label>
                            <input id="proj-year" type="text" className="modalInput" value={completionYear} onChange={(e) => setCompletionYear(e.target.value)} placeholder="e.g. 2024" maxLength={4} />
                        </div>
                        <div className="modalField">
                            <label className="modalLabel" htmlFor="proj-size">Size</label>
                            <input id="proj-size" type="text" className="modalInput" value={size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. 450 sqm" />
                        </div>
                        <div className="modalField">
                            <label className="modalLabel" htmlFor="proj-style">Design Style</label>
                            <input id="proj-style" type="text" className="modalInput" value={designStyle} onChange={(e) => setDesignStyle(e.target.value)} placeholder="e.g. Modern Minimalist" />
                        </div>
                        <div className="modalField">
                            <label className="modalLabel" htmlFor="proj-client">Client</label>
                            <input id="proj-client" type="text" className="modalInput" value={client} onChange={(e) => setClient(e.target.value)} placeholder="e.g. Private Client" />
                        </div>
                        <div className="modalField">
                            <label className="modalLabel" htmlFor="proj-date">Project Date</label>
                            <input
                                id="proj-date"
                                type="date"
                                className={`modalInput ${dateError ? 'inputError' : ''}`}
                                value={date}
                                max={TODAY}
                                min="1900-01-01"
                                onChange={(e) => handleDateChange(e.target.value)}
                            />
                            {dateError && <p className="modalInputError">{dateError}</p>}
                        </div>
                    </div>
                </div>

                <div className="modalFooter">
                    <button className="modalBtnGhost" onClick={onClose} disabled={saving}>Cancel</button>
                    <button
                        className="modalBtnPrimary"
                        onClick={handleSubmit}
                        disabled={saving || !!dateError}
                    >
                        {saving ? 'Saving...' : project ? 'Save Changes' : 'Add Project'}
                    </button>
                </div>
            </div>
        </div>
    );
}