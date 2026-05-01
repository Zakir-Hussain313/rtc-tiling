'use client';

import { useState, useEffect } from 'react';
import ServicesList from './ServicesList';
import ServiceFormModal from './ServiceFormModal';
import '@/styles/Admin/Services/ServicesEditor.css';

export type Service = {
    _id: string;
    title: string;
    description: string;
    images: string[];
    imagePublicIds: string[];
    serviceType: string;
    location: string;
    estimatedDuration: string;
    maximumArea: string;
    finishStyle: string;
    suitableFor: string;
    slug: string;
};

export function generateServiceSlug(title: string): string {
    return '/services/' + title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function ServicesEditor() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch('/api/services');
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();
                setServices(json.data ?? []);
            } catch (err) {
                console.error('[ServicesEditor] Failed to load services', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    function handleAdd() {
        setEditingService(null);
        setModalOpen(true);
    }

    function handleEdit(service: Service) {
        setEditingService(service);
        setModalOpen(true);
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this service?')) return;
        try {
            const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            setServices((prev) => prev.filter((s) => s._id !== id));
        } catch (err) {
            console.error('[ServicesEditor] Delete failed', err);
            alert('Failed to delete service.');
        }
    }

    type SaveData = Omit<Service, '_id' | 'slug'> & {
        removedPublicIds?: string[];
        keptImages?: string[];
    };

    async function handleSave(data: SaveData) {
        setSaving(true);
        try {
            if (editingService) {
                const res = await fetch(`/api/services/${editingService._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...data,
                        removedPublicIds: data.removedPublicIds ?? [],
                    }),
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error ?? 'Failed to update');
                }
                const json = await res.json();
                setServices((prev) =>
                    prev.map((s) => (s._id === editingService._id ? json.data : s))
                );
            } else {
                const res = await fetch('/api/services', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error ?? 'Failed to create');
                }
                const json = await res.json();
                setServices((prev) => [...prev, json.data]);
            }
            setModalOpen(false);
        } catch (err: any) {
            console.error('[ServicesEditor] Save failed', err);
            alert(err.message ?? 'Failed to save service.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="servicesEditorBody">
            <div className="servicesEditorHeader">
                <div>
                    <div className="servicesEditorEyebrow">Editing</div>
                    <h1 className="servicesEditorHeading">Services</h1>
                    <p className="servicesEditorSub">Add, edit or remove services shown on your website.</p>
                </div>
                <button className="servicesEditorBtnPrimary" onClick={handleAdd} disabled={saving}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Service
                </button>
            </div>

            {loading ? (
                <p style={{ padding: '2rem', opacity: 0.5 }}>Loading services…</p>
            ) : (
                <ServicesList
                    services={services}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {modalOpen && (
                <ServiceFormModal
                    service={editingService}
                    onSave={handleSave}
                    onClose={() => setModalOpen(false)}
                    saving={saving}
                />
            )}
        </main>
    );
}