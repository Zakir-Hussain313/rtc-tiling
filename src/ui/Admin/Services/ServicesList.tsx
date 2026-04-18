'use client';

import { Service, generateServiceSlug } from './ServicesEditor';
import "@/styles/Admin/Services/ServicesList.css";

interface ServicesListProps {
    services: Service[];
    onEdit: (service: Service) => void;
    onDelete: (id: string) => void; // string _id now
}

export default function ServicesList({ services, onEdit, onDelete }: ServicesListProps) {
    if (services.length === 0) {
        return (
            <div className="servicesEmptyState">
                <div className="servicesEmptyIcon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                </div>
                <p className="servicesEmptyText">No services yet</p>
                <p className="servicesEmptySub">Click &quot;Add Service&quot; to get started</p>
            </div>
        );
    }

    return (
        <div className="servicesListCard">
            <div className="servicesListHeader">
                <span>Image</span>
                <span>Title</span>
                <span>Description</span>
                <span>Auto Link</span>
                <span>Actions</span>
            </div>
            <div className="servicesListBody">
                {services.map((service) => (
                    <div key={service._id} className="servicesListRow">

                        <div className="servicesListImg">
                            {service.image ? (
                                <img src={service.image} alt={service.title} />
                            ) : (
                                <div className="servicesListImgPlaceholder">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        <div className="servicesListTitle">{service.title}</div>
                        <div className="servicesListDesc">{service.description}</div>

                        <div className="servicesListLink">
                            <span className="servicesListLinkBadge">
                                {generateServiceSlug(service.title)}
                            </span>
                        </div>

                        <div className="servicesListActions">
                            <button className="servicesActionBtn edit" onClick={() => onEdit(service)} title="Edit">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                                </svg>
                                <span>Edit</span>
                            </button>
                            <button className="servicesActionBtn delete" onClick={() => onDelete(service._id)} title="Delete">
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

