'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import './testimonials.css';

type Testimonial = {
    _id: string;
    name: string;
    role: string;
    review: string;
    rating: number;
    image: string;
    imagePublicId: string;
    approved: boolean;
    order: number;
};

const EMPTY_FORM = {
    name: '',
    role: 'Google Review',
    review: '',
    rating: 5,
    image: '',
    imagePublicId: '',
};

export default function TestimonialsAdmin() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const inputRef = useRef<HTMLInputElement>(null);

    const load = useCallback(async () => {
        setLoading(true);
        const res = await fetch('/api/testimonials?admin=1');
        const json = await res.json();
        setTestimonials(json.data ?? []);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setShowModal(false);
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    function openAdd() {
        setEditing(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    }

    function openEdit(t: Testimonial) {
        setEditing(t);
        setForm({
            name: t.name,
            role: t.role,
            review: t.review,
            rating: t.rating,
            image: t.image,
            imagePublicId: t.imagePublicId,
        });
        setShowModal(true);
    }

    function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setForm(f => ({ ...f, image: ev.target?.result as string }));
        reader.readAsDataURL(file);
    }

    async function handleSave() {
        if (!form.name.trim() || !form.review.trim() || saving) return;
        setSaving(true);
        const method = editing ? 'PUT' : 'POST';
        const body = editing ? { ...form, _id: editing._id, approved: true } : { ...form, approved: true };
        await fetch('/api/testimonials', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        setSaving(false);
        setShowModal(false);
        load();
    }

    async function handleDelete(t: Testimonial) {
        if (!confirm(`Delete ${t.name}'s testimonial?`)) return;
        await fetch('/api/testimonials', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: t._id, imagePublicId: t.imagePublicId }),
        });
        load();
    }

    return (
        <main className="testiEditorBody">
            <div className="testiEditorHeader">
                <div>
                    <div className="testiEditorEyebrow">Editing</div>
                    <h1 className="testiEditorHeading">Testimonials</h1>
                    <p className="testiEditorSub">Add, edit or remove testimonials shown on your website.</p>
                </div>
                <button className="testiEditorBtnPrimary" onClick={openAdd}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Testimonial
                </button>
            </div>

            {loading ? (
                <p style={{ opacity: 0.5, fontFamily: 'var(--font-body)', fontSize: '14px' }}>Loading testimonials…</p>
            ) : testimonials.length === 0 ? (
                <div className="testiEmptyState">
                    <div className="testiEmptyIcon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                        </svg>
                    </div>
                    <p className="testiEmptyText">No testimonials yet</p>
                    <p className="testiEmptySub">Click &quot;Add Testimonial&quot; to get started</p>
                </div>
            ) : (
                <div className="testiListCard">
                    <div className="testiListHeader">
                        <span>Photo</span>
                        <span>Details</span>
                        <span>Rating</span>
                        <span>Actions</span>
                    </div>
                    <div className="testiListBody">
                        {testimonials.map((t) => (
                            <div key={t._id} className="testiListRow">
                                <div className="testiListAvatar">
                                    {t.image ? (
                                        <Image src={t.image} alt={t.name} fill style={{ objectFit: 'cover' }} />
                                    ) : '👤'}
                                </div>
                                <div className="testiListInfo">
                                    <span className="testiListName">{t.name}</span>
                                    <span className="testiListRole">{t.role}</span>
                                    <span className="testiListReview">{t.review}</span>
                                </div>
                                <div className="testiListStars">
                                    {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                                </div>
                                <div className="testiListActions">
                                    <button className="testiActionBtn edit" onClick={() => openEdit(t)}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 20h9" />
                                            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button className="testiActionBtn delete" onClick={() => handleDelete(t)}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                            <path d="M10 11v6M14 11v6" />
                                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="testiModalOverlay" onClick={() => setShowModal(false)}>
                    <div className="testiModalBox" onClick={e => e.stopPropagation()}>
                        <div className="testiModalHeader">
                            <h2 className="testiModalTitle">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                            <button className="testiModalCloseBtn" onClick={() => setShowModal(false)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className="testiModalBody">
                            {/* Photo */}
                            <div className="testiModalField">
                                <label className="testiModalLabel">Photo (optional)</label>
                                <div
                                    className={`testiAvatarDropzone ${form.image ? 'hasImage' : ''}`}
                                    onClick={() => inputRef.current?.click()}
                                >
                                    {form.image && (
                                        <div className="testiAvatarPreview">
                                            <Image src={form.image} alt="preview" fill style={{ objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    <div className="testiAvatarDropzoneInner">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="16 16 12 12 8 16" />
                                            <line x1="12" y1="12" x2="12" y2="21" />
                                            <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
                                        </svg>
                                        <span>{form.image ? 'Click to replace' : 'Drag & drop or click to upload'}</span>
                                    </div>
                                    {form.image && <div className="testiAvatarOverlay">Click to replace</div>}
                                    <input
                                        ref={inputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleImage}
                                    />
                                </div>
                            </div>

                            {/* Name */}
                            <div className="testiModalField">
                                <label className="testiModalLabel">Name</label>
                                <input
                                    className="testiModalInput"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            {/* Role */}
                            <div className="testiModalField">
                                <label className="testiModalLabel">Role</label>
                                <input
                                    className="testiModalInput"
                                    value={form.role}
                                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                    placeholder="e.g. Google Review"
                                />
                            </div>

                            {/* Review */}
                            <div className="testiModalField">
                                <label className="testiModalLabel">Review</label>
                                <textarea
                                    className="testiModalTextarea"
                                    value={form.review}
                                    onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
                                    placeholder="Write the review here..."
                                    rows={4}
                                />
                            </div>

                            {/* Rating */}
                            <div className="testiModalField">
                                <label className="testiModalLabel">Rating</label>
                                <select
                                    className="testiModalSelect"
                                    value={form.rating}
                                    onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}
                                >
                                    {[5, 4, 3, 2, 1].map(n => (
                                        <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''} — {'★'.repeat(n)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="testiModalFooter">
                            <button className="testiModalBtnGhost" onClick={() => setShowModal(false)} disabled={saving}>Cancel</button>
                            <button className="testiModalBtnPrimary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Testimonial'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}