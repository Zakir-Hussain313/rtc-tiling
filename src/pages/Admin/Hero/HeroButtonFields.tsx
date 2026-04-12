'use client';

import { useState } from 'react';
import '@/styles/Admin/Hero/HeroButtonFields.css';

export default function HeroButtonFields() {
    const [btnText, setBtnText] = useState('View Our Work');
    const [btnLink, setBtnLink] = useState('/projects');

    return (
        <div className="heroBtnCard">
            <div className="heroBtnCardHeader">
                <div className="heroBtnCardIcon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="10" rx="2" />
                        <path d="M10 11h4M12 9v4" />
                    </svg>
                </div>
                <div>
                    <h3 className="heroBtnCardTitle">Call to Action Button</h3>
                    <p className="heroBtnCardSub">Set the button label and where it links to</p>
                </div>
            </div>

            <div className="heroBtnRow">
                <div className="heroFieldGroup">
                    <label className="heroFieldLabel" htmlFor="btnText">Button Text</label>
                    <input
                        id="btnText"
                        type="text"
                        className="heroFieldInput"
                        value={btnText}
                        maxLength={40}
                        onChange={(e) => setBtnText(e.target.value)}
                        placeholder="e.g. View Our Work"
                    />
                </div>

                <div className="heroFieldGroup">
                    <label className="heroFieldLabel" htmlFor="btnLink">Button Link</label>
                    <div className="heroLinkInputWrap">
                        <span className="heroLinkPrefix">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                            </svg>
                        </span>
                        <input
                            id="btnLink"
                            type="text"
                            className="heroFieldInput heroLinkInput"
                            value={btnLink}
                            onChange={(e) => setBtnLink(e.target.value)}
                            placeholder="/projects or https://..."
                        />
                    </div>
                </div>
            </div>

            <div className="heroBtnPreview">
                <span className="heroBtnPreviewLabel">Preview</span>
                <button className="heroBtnPreviewBtn">{btnText || 'Button'}</button>
            </div>
        </div>
    );
}