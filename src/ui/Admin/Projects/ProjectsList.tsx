'use client';

import { Project, generateSlug } from './ProjectsEditor';
import '@/styles/Admin/Projects/PorjectsListing.css';

interface ProjectsListProps {
    projects: Project[];
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
    onToggleFeatured: (id: string, current: boolean) => void;   // 👈 new
}

function formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ProjectsList({ projects, onEdit, onDelete, onToggleFeatured }: ProjectsListProps) {
    if (projects.length === 0) {
        return (
            <div className="projectsEmptyState">
                <div className="projectsEmptyIcon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                    </svg>
                </div>
                <p className="projectsEmptyText">No projects yet</p>
                <p className="projectsEmptySub">Click "Add Project" to get started</p>
            </div>
        );
    }

    return (
        <div className="projectsListCard">
            <div className="projectsListHeader">
                <span>Image</span>
                <span>Title</span>
                <span>Date</span>
                <span>Featured</span>        {/* 👈 new */}
                <span>Auto Link</span>
                <span>Actions</span>
            </div>
            <div className="projectsListBody">
                {projects.map((project) => (
                    <div key={project._id} className="projectsListRow">

                        <div className="projectsListImg">
                            {project.image ? (
                                <img src={project.image} alt={project.title} />
                            ) : (
                                <div className="projectsListImgPlaceholder">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        <div className="projectsListInfo">
                            <span className="projectsListTitle">{project.title}</span>
                            <span className="projectsListDesc">{project.description}</span>
                        </div>

                        <div className="projectsListDate">
                            <span>{formatDate(project.date)}</span>
                        </div>

                        {/* 👇 new featured toggle */}
                        <div className="projectsListFeatured">
                            <label className="featuredToggle" title={project.featured ? 'Remove from featured' : 'Mark as featured'}>
                                <input
                                    type="checkbox"
                                    checked={project.featured ?? false}
                                    onChange={() => onToggleFeatured(project._id, project.featured)}
                                />
                                <span className="featuredToggleTrack">
                                    <span className="featuredToggleThumb" />
                                </span>
                                <span className="featuredToggleLabel">
                                    {project.featured ? 'Featured' : 'Not featured'}
                                </span>
                            </label>
                        </div>

                        <div className="projectsListLink">
                            <span className="projectsListLinkBadge">
                                {generateSlug(project.title)}
                            </span>
                        </div>

                        <div className="projectsListActions">
                            <button
                                className="projectsActionBtn edit"
                                onClick={() => onEdit(project)}
                                title="Edit"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                                </svg>
                                <span>Edit</span>
                            </button>
                            <button
                                className="projectsActionBtn delete"
                                onClick={() => onDelete(project._id)}
                                title="Delete"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                    <path d="M10 11v6M14 11v6" />
                                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                                </svg>
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}