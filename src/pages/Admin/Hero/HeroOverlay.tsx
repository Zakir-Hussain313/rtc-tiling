'use client';

import { useState } from 'react';
import '@/styles/Admin/Hero/HeroOverlay.css';

export default function HeroOverlay() {
    const [opacity, setOpacity] = useState(40);

    return (
        <div className="heroOverlayCard">
            <div className="heroOverlayCardHeader">
                <div className="heroOverlayCardIcon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a10 10 0 010 20V2z" />
                    </svg>
                </div>
                <div>
                    <h3 className="heroOverlayCardTitle">Overlay Opacity</h3>
                    <p className="heroOverlayCardSub">Controls the dark overlay on top of the background image</p>
                </div>
                <div className="heroOverlayBadge">{opacity}%</div>
            </div>

            <div className="heroOverlaySliderWrap">
                <span className="heroOverlaySliderEndLabel">0%</span>
                <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={opacity}
                    className="heroOverlaySlider"
                    onChange={(e) => setOpacity(Number(e.target.value))}
                />
                <span className="heroOverlaySliderEndLabel">100%</span>
            </div>

            <div className="heroOverlayPreview">
                <div
                    className="heroOverlayPreviewBg"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=60)' }}
                >
                    <div
                        className="heroOverlayPreviewLayer"
                        style={{ opacity: opacity / 100 }}
                    />
                    <div className="heroOverlayPreviewText">
                        <div className="heroOverlayPreviewHeading">Hero Heading</div>
                        <div className="heroOverlayPreviewSub">Your subheading text appears here</div>
                    </div>
                </div>
            </div>
        </div>
    );
}