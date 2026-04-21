'use client';

import { useState, useRef, useEffect } from 'react';
import { Project, generateSlug } from './ProjectsEditor';
import '@/styles/Admin/Projects/ProjectFormModal.css';

interface ProjectFormModalProps {
    project: Project | null;
    onSave: (data: Omit<Project, '_id' | 'slug'>) => void;
    onClose: () => void;
    saving: boolean;
}

const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD, used as max date

export default function ProjectFormModal({ project, onSave, onClose, saving }: ProjectFormModalProps) {
    const [title,          setTitle]          = useState('');
    const [description,    setDescription]    = useState('');
    const [type,           setType]           = useState('');
    const [location,       setLocation]       = useState('');
    const [completionYear, setCompletionYear] = useState('');
    const [size,           setSize]           = useState('');
    const [designStyle,    setDesignStyle]    = useState('');
    const [client,         setClient]         = useState('');
    const [date,           setDate]           = useState('');
    const [dateError,      setDateError]      = useState('');
    const [image,          setImage]          = useState<string | null>(null);
    const [imageName,      setImageName]      = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTitle         (project?.title          ?? '');
        setDescription   (project?.description    ?? '');
        setType          (project?.type           ?? '');
        setLocation      (project?.location       ?? '');
        setCompletionYear(project?.completionYear ?? '');
        setSize          (project?.size           ?? '');
        setDesignStyle   (project?.designStyle    ?? '');
        setClient        (project?.client         ?? '');
        setDate          (project?.date           ?? '');
        setDateError     ('');
        setImage         (project?.image          ?? null);
        setImageName     (project?.image ? 'Current image' : null);
    }, [project]);

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

    function validateDate(value: string): string {
        if (!value) return ''; // date is optional

        // Must match YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(value)) return 'Invalid date format.';

        const parsed = new Date(value);
        if (isNaN(parsed.getTime())) return 'Invalid date.';

        const year = parsed.getFullYear();
        if (year < 1900) return 'Date must be after 1900.';

        const today = new Date(TODAY);
        if (parsed > today) return 'Date cannot be in the future.';

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
            alert('Enter a valid completion year (between 1900 and ' + (currentYear + 5) + ')');
            return;
        }

        const dateValidationError = validateDate(date);
        if (dateValidationError) {
            setDateError(dateValidationError);
            return;
        }

        onSave({ title, description, type, location, completionYear, size, designStyle, client, date, image });
    }

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalBox" onClick={(e) => e.stopPropagation()}>

                <div className="modalHeader">
                    <h2 className="modalTitle">
                        {project ? 'Edit Project' : 'Add Project'}
                    </h2>
                    <button className="modalCloseBtn" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="modalBody">

                    {/* Image */}
                    <div className="modalField">
                        <label className="modalLabel">Project Image</label>
                        <div
                            className={`modalDropzone ${image ? 'hasImage' : ''}`}
                            onClick={() => inputRef.current?.click()}
                        >
                            {image ? (
                                <>
                                    <img src={image} alt="preview" className="modalImagePreview" />
                                    <div className="modalDropzoneOverlay">Click to replace</div>
                                </>
                            ) : (
                                <div className="modalDropzoneInner">
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
                        {imageName && <p className="modalImageName">{imageName}</p>}
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

                    {/* Two-column grid */}
                    <div className="modalGrid">

                        <div className="modalField">
                            <label className="modalLabel" htmlFor="proj-type">Type</label>
                            <input
                                id="proj-type"
                                type="text"
                                className="modalInput"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                placeholder="e.g. Residential"
                            />
                        </div>

                        <div className="modalField">
                            <label className="modalLabel" htmlFor="proj-location">Location</label>
                            <input
                                id="proj-location"
                                type="text"
                                className="modalInput"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. Dubai, UAE"
                            />
                        </div>

                        <div className="modalField">
                            <label className="modalLabel" htmlFor="proj-year">Completion Year</label>
                            <input
                                id="proj-year"
                                type="text"
                                className="modalInput"
                                value={completionYear}
                                onChange={(e) => setCompletionYear(e.target.value)}
                                placeholder="e.g. 2024"
                                maxLength={4}
                            />
                        </div>

                        <div className="modalField">
                            <label className="modalLabel" htmlFor="proj-size">Size</label>
                            <input
                                id="proj-size"
                                type="text"
                                className="modalInput"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                placeholder="e.g. 450 sqm"
                            />
                        </div>

                        <div className="modalField">
                            <label className="modalLabel" htmlFor="proj-style">Design Style</label>
                            <input
                                id="proj-style"
                                type="text"
                                className="modalInput"
                                value={designStyle}
                                onChange={(e) => setDesignStyle(e.target.value)}
                                placeholder="e.g. Modern Minimalist"
                            />
                        </div>

                        <div className="modalField">
                            <label className="modalLabel" htmlFor="proj-client">Client</label>
                            <input
                                id="proj-client"
                                type="text"
                                className="modalInput"
                                value={client}
                                onChange={(e) => setClient(e.target.value)}
                                placeholder="e.g. Private Client"
                            />
                        </div>

                        {/* Date */}
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
                            {dateError && (
                                <p className="modalInputError">{dateError}</p>
                            )}
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