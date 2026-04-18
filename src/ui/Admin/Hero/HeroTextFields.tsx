'use client';

import '@/styles/Admin/Hero/HeroTextFields.css';

interface HeroTextFieldsProps {
    headline: string;
    subheading: string;
    onHeadlineChange: (val: string) => void;
    onSubheadingChange: (val: string) => void;
}

export default function HeroTextFields({
    headline,
    subheading,
    onHeadlineChange,
    onSubheadingChange,
}: HeroTextFieldsProps) {
    return (
        <div className="heroTextCard">
            <div className="heroTextCardHeader">
                <div className="heroTextCardIcon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                </div>
                <div>
                    <h3 className="heroTextCardTitle">Hero Text</h3>
                    <p className="heroTextCardSub">Edit the headline and subheading shown on the hero section</p>
                </div>
            </div>

            <div className="heroFieldGroup">
                <label className="heroFieldLabel" htmlFor="headline">
                    Headline
                    <span className="heroCharCount">{headline.length} / 80</span>
                </label>
                <input
                    id="headline"
                    type="text"
                    className="heroFieldInput"
                    value={headline}
                    maxLength={80}
                    onChange={(e) => onHeadlineChange(e.target.value)}
                    placeholder="Enter hero headline..."
                />
            </div>

            <div className="heroFieldGroup">
                <label className="heroFieldLabel" htmlFor="subheading">
                    Subheading
                    <span className="heroCharCount">{subheading.length} / 180</span>
                </label>
                <textarea
                    id="subheading"
                    className="heroFieldTextarea"
                    value={subheading}
                    maxLength={180}
                    rows={3}
                    onChange={(e) => onSubheadingChange(e.target.value)}
                    placeholder="Enter hero subheading..."
                />
            </div>
        </div>
    );
}