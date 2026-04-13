'use client';

import { useState } from 'react';
import ServicesList from './ServicesList';
import ServiceFormModal from './ServiceFormModal';
import '@/styles/Admin/Services/ServicesEditor.css';

export type Service = {
    id: number;
    title: string;
    description: string;
    image: string | null;
};

export function generateServiceSlug(title: string): string {
    return '/services/' + title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const initialServices: Service[] = [
    { id: 1, title: 'Floor Tiling', description: 'Premium floor tiling using high-quality porcelain and ceramic tiles for residential and commercial spaces.', image: null },
    { id: 2, title: 'Wall Cladding', description: 'Expert wall cladding installation to enhance the aesthetic and durability of your interior and exterior walls.', image: null },
    { id: 3, title: 'Pool Tiling', description: 'Specialist pool tiling services using waterproof, slip-resistant tiles built to last.', image: null },
];

export default function ServicesEditor() {
    const [services, setServices] = useState<Service[]>(initialServices);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    function handleAdd() {
        setEditingService(null);
        setModalOpen(true);
    }

    function handleEdit(service: Service) {
        setEditingService(service);
        setModalOpen(true);
    }

    function handleDelete(id: number) {
        setServices((prev) => prev.filter((s) => s.id !== id));
    }

    function handleSave(data: Omit<Service, 'id'>) {
        if (editingService) {
            setServices((prev) =>
                prev.map((s) => (s.id === editingService.id ? { ...data, id: editingService.id } : s))
            );
        } else {
            setServices((prev) => [...prev, { ...data, id: Date.now() }]);
        }
        setModalOpen(false);
    }

    return (
        <main className="servicesEditorBody">

            <div className="servicesEditorHeader">
                <div>
                    <div className="servicesEditorEyebrow">Editing</div>
                    <h1 className="servicesEditorHeading">Services</h1>
                    <p className="servicesEditorSub">Add, edit or remove services shown on your website.</p>
                </div>
                <button className="servicesEditorBtnPrimary" onClick={handleAdd}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Service
                </button>
            </div>

            <ServicesList
                services={services}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {modalOpen && (
                <ServiceFormModal
                    service={editingService}
                    onSave={handleSave}
                    onClose={() => setModalOpen(false)}
                />
            )}

        </main>
    );
}