'use client';

import { useState, useEffect } from 'react';
import ProjectsList from './ProjectsList';
import ProjectFormModal from './ProjectFormModal';
import '@/styles/Admin/Projects/ProjectsEditor.css';

export type Project = {
    _id: string;
    title: string;
    description: string;
    type: string;
    location: string;
    completionYear: string;
    size: string;
    designStyle: string;
    client: string;
    date: string;
    image: string | null;
    slug: string;
    featured: boolean;
};

export function generateSlug(title: string): string {
    return '/projects/' + title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function ProjectsEditor() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch('/api/projects');
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();
                setProjects(json.data ?? []);
            } catch (err) {
                console.error('[ProjectsEditor] Failed to load projects', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    function handleAdd() {
        setEditingProject(null);
        setModalOpen(true);
    }

    function handleEdit(project: Project) {
        setEditingProject(project);
        setModalOpen(true);
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this project?')) return;
        try {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            setProjects((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            console.error('[ProjectsEditor] Delete failed', err);
            alert('Failed to delete project.');
        }
    }

    async function handleSave(data: Omit<Project, '_id' | 'slug'>) {
        setSaving(true);
        try {
            if (editingProject) {
                const res = await fetch(`/api/projects/${editingProject._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error ?? 'Failed to update');
                }
                const json = await res.json();
                setProjects((prev) =>
                    prev.map((p) => (p._id === editingProject._id ? json.data : p))
                );
            } else {
                const res = await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error ?? 'Failed to create');
                }
                const json = await res.json();
                setProjects((prev) => [...prev, json.data]);
            }
            setModalOpen(false);
        } catch (err: any) {
            console.error('[ProjectsEditor] Save failed', err);
            alert(err.message ?? 'Failed to save project.');
        } finally {
            setSaving(false);
        }
    }

    async function handleToggleFeatured(id: string, current: boolean) {
        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured: !current }),
            });
            if (!res.ok) throw new Error('Failed to update');
            const json = await res.json();
            setProjects((prev) =>
                prev.map((p) => (p._id === id ? json.data : p))
            );
        } catch (err) {
            console.error('[ProjectsEditor] Toggle featured failed', err);
            alert('Failed to update featured status.');
        }
    }

    return (
        <main className="projectsEditorBody">
            <div className="projectsEditorHeader">
                <div>
                    <div className="projectsEditorEyebrow">Editing</div>
                    <h1 className="projectsEditorHeading">Projects</h1>
                    <p className="projectsEditorSub">Add, edit or remove projects shown on your website.</p>
                </div>
                <button className="projectsEditorBtnPrimary" onClick={handleAdd} disabled={saving}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Project
                </button>
            </div>

            {loading ? (
                <p style={{ padding: '2rem', opacity: 0.5 }}>Loading projects…</p>
            ) : (
                <ProjectsList
                    projects={projects}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleFeatured={handleToggleFeatured}
                />
            )}

            {modalOpen && (
                <ProjectFormModal
                    project={editingProject}
                    onSave={handleSave}
                    onClose={() => setModalOpen(false)}
                    saving={saving}
                />
            )}
        </main>
    );
}