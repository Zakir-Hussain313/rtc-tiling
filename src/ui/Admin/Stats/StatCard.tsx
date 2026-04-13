'use client';

import { StatItem } from './StatsEditor';
import '@/styles/Admin/Stats/StatCard.css';

interface StatCardProps {
    stat: StatItem;
    onChange: (field: keyof StatItem, value: string) => void;
}

export default function StatCard({ stat, onChange }: StatCardProps) {
    return (
        <div className="statCardEditor">

            {/* Preview strip */}
            <div className="statCardPreviewStrip">
                <div className="statCardPreviewValue">
                    {stat.value}
                    <span className="statCardPreviewSuffix">{stat.suffix}</span>
                </div>
                <div className="statCardPreviewCardLabel">{stat.label || '—'}</div>
            </div>

            <div className="statCardFields">

                {/* Number + Suffix side by side */}
                <div className="statCardRow">
                    <div className="statCardField">
                        <label className="statCardFieldLabel">Number</label>
                        <input
                            type="text"
                            className="statCardInput"
                            value={stat.value}
                            onChange={(e) => onChange('value', e.target.value)}
                            placeholder="e.g. 99"
                            maxLength={6}
                        />
                    </div>

                    <div className="statCardField">
                        <label className="statCardFieldLabel">Suffix</label>
                        <div className="statCardSuffixToggle">
                            <button
                                type="button"
                                className={`statCardSuffixBtn ${stat.suffix === '+' ? 'active' : ''}`}
                                onClick={() => onChange('suffix', '+')}
                            >
                                +
                            </button>
                            <button
                                type="button"
                                className={`statCardSuffixBtn ${stat.suffix === '%' ? 'active' : ''}`}
                                onClick={() => onChange('suffix', '%')}
                            >
                                %
                            </button>
                        </div>
                    </div>
                </div>

                {/* Label */}
                <div className="statCardField">
                    <label className="statCardFieldLabel">Label</label>
                    <input
                        type="text"
                        className="statCardInput"
                        value={stat.label}
                        onChange={(e) => onChange('label', e.target.value)}
                        placeholder="e.g. Projects Completed"
                        maxLength={40}
                    />
                </div>

            </div>
        </div>
    );
}