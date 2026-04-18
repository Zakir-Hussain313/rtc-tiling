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

export default function ProjectFormModal({ project, onSave, onClose, saving }: ProjectFormModalProps) {
    const [title, setTitle] = useState(project?.title ?? '');
    const [description, setDescription] = useState(project?.description ?? '');
    const [day, setDay] = useState(project?.day ?? '');
    const [month, setMonth] = useState(project?.month ?? '');
    const [year, setYear] = useState(project?.year ?? '');
    const [image, setImage] = useState<string | null>(project?.image ?? null);
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
        if (!title.trim() || saving) return;

        const d = Number(day);
        const m = Number(month);
        const y = Number(year);

        // basic numeric validation
        if (!d || !m || !y) {
            alert("Please enter a valid date");
            return;
        }

        if (d < 1 || d > 31) {
            alert("Day must be between 1 and 31");
            return;
        }

        if (m < 1 || m > 12) {
            alert("Month must be between 1 and 12");
            return;
        }

        const currentYear = new Date().getFullYear();
        if (y < 1900 || y > currentYear) {
            alert("Enter a valid year");
            return;
        }

        // real date validation (handles Feb, leap years, etc.)
        const date = new Date(y, m - 1, d);
        if (
            date.getFullYear() !== y ||
            date.getMonth() !== m - 1 ||
            date.getDate() !== d
        ) {
            alert("Invalid date");
            return;
        }

        // ❗ NEW: prevent future dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date > today) {
            alert("Date cannot be in the future");
            return;
        }

        onSave({ title, description, day, month, year, image });
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

                    <div className="modalField">
                        <label className="modalLabel" htmlFor="proj-title">Title</label>
                        <input
                            id="proj-title"
                            type="text"
                            className="modalInput"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. POOL TILED"
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

                    <div className="modalField">
                        <label className="modalLabel">Date</label>
                        <div className="modalDateRow">
                            <input
                                type="text"
                                className="modalInput modalDateInput"
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                                placeholder="DD"
                                maxLength={2}
                            />
                            <span className="modalDateSep">/</span>
                            <input
                                type="text"
                                className="modalInput modalDateInput"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                placeholder="MM"
                                maxLength={2}
                            />
                            <span className="modalDateSep">/</span>
                            <input
                                type="text"
                                className="modalInput modalDateInput modalDateInputYear"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                placeholder="YYYY"
                                maxLength={4}
                            />
                        </div>
                    </div>

                </div>

                <div className="modalFooter">
                    <button className="modalBtnGhost" onClick={onClose} disabled={saving}>Cancel</button>
                    <button className="modalBtnPrimary" onClick={handleSubmit} disabled={saving}>
                        {saving ? 'Saving...' : project ? 'Save Changes' : 'Add Project'}
                    </button>
                </div>

            </div>
        </div>
    );
}