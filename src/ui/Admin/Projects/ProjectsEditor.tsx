'use client';

import { useState } from 'react';
import ProjectsList from './ProjectsList';
import ProjectFormModal from './ProjectFormModal';
import '@/styles/Admin/Projects/ProjectsEditor.css';

export type Project = {
    id: number;
    title: string;
    description: string;
    day: string;
    month: string;
    year: string;
    image: string | null;
};

export function generateSlug(title: string): string {
    return '/projects/' + title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const initialProjects: Project[] = [
    { id: 1, title: 'POOL TILED', description: 'Complete pool tiling project with premium porcelain.', day: '04', month: '03', year: '2025', image: null },
    { id: 2, title: 'KITCHEN DONE', description: 'Full kitchen renovation with custom flooring.', day: '10', month: '05', year: '2025', image: null },
    { id: 3, title: 'SKIRTING FINISHED', description: 'Skirting installation across 3 floors.', day: '18', month: '06', year: '2025', image: null },
];

export default function ProjectsEditor() {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    function handleAdd() {
        setEditingProject(null);
        setModalOpen(true);
    }

    function handleEdit(project: Project) {
        setEditingProject(project);
        setModalOpen(true);
    }

    function handleDelete(id: number) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
    }

    function handleSave(data: Omit<Project, 'id'>) {
        if (editingProject) {
            setProjects((prev) =>
                prev.map((p) => (p.id === editingProject.id ? { ...data, id: editingProject.id } : p))
            );
        } else {
            setProjects((prev) => [...prev, { ...data, id: Date.now() }]);
        }
        setModalOpen(false);
    }

    return (
        <main className="projectsEditorBody">
            <div className="projectsEditorHeader">
                <div>
                    <div className="projectsEditorEyebrow">Editing</div>
                    <h1 className="projectsEditorHeading">Projects</h1>
                    <p className="projectsEditorSub">Add, edit or remove projects shown on your website.</p>
                </div>
                <button className="projectsEditorBtnPrimary" onClick={handleAdd}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Project
                </button>
            </div>

            <ProjectsList
                projects={projects}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {modalOpen && (
                <ProjectFormModal
                    project={editingProject}
                    onSave={handleSave}
                    onClose={() => setModalOpen(false)}
                />
            )}

        </main>
    );
}