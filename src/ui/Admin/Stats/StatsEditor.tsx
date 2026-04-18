'use client';

import { useState, useEffect } from 'react';
import StatCard from './StatCard';
import '@/styles/Admin/Stats/StatsEditor.css';

export type Suffix = '+' | '%';

export type StatItem = {
    id: number;
    value: string;
    suffix: Suffix;
    label: string;
};

const defaultStats: StatItem[] = [
    { id: 1, value: '99',  suffix: '+', label: 'Projects Completed'  },
    { id: 2, value: '10',  suffix: '+', label: 'Team Members'        },
    { id: 3, value: '92',  suffix: '%', label: 'Client Retention'    },
    { id: 4, value: '80',  suffix: '+', label: 'Successful Launches' },
];

export default function StatsEditor() {
    const [stats, setStats] = useState<StatItem[]>(defaultStats);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    // Load stats from API on mount
    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/stats');
                const data = await res.json();

                if (res.ok && data.data?.stats?.length === 4) {
                    setStats(data.data.stats);
                }
            } catch (err) {
                console.error('Failed to fetch stats:', err);
                setError('Failed to load stats. Using defaults.');
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    function handleChange(id: number, field: keyof StatItem, value: string) {
        setStats((prev) =>
            prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
        );
        setSaved(false);
        setError('');
    }

    async function handleSave() {
        setSaving(true);
        setError('');

        try {
            const res = await fetch('/api/stats', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stats }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to save stats');
                return;
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            console.error('Failed to save stats:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="statsEditorBody">
                <div className="statsEditorLoading">
                    <span className="statsEditorSpinner" />
                    Loading stats...
                </div>
            </main>
        );
    }

    return (
        <main className="statsEditorBody">

            <div className="statsEditorHeader">
                <div>
                    <div className="statsEditorEyebrow">Editing</div>
                    <h1 className="statsEditorHeading">Business Stats</h1>
                    <p className="statsEditorSub">Edit the four stats displayed on your website.</p>
                </div>
                <button
                    className={`statsEditorBtnPrimary ${saved ? 'saved' : ''}`}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <span className="statsEditorSpinner" />
                            Saving...
                        </>
                    ) : saved ? (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Saved!
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                                <polyline points="17 21 17 13 7 13 7 21" />
                                <polyline points="7 3 7 8 15 8" />
                            </svg>
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="statsEditorError">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </div>
            )}

            <div className="statsEditorGrid">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.id}
                        stat={stat}
                        onChange={(field, value) => handleChange(stat.id, field, value)}
                    />
                ))}
            </div>

        </main>
    );
}