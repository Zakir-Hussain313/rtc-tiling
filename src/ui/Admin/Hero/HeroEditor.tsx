
import HeroImageUpload from './HeroImageUpload';
import HeroTextFields from './HeroTextFields';
import HeroButtonFields from './HeroButtonFields';
import HeroOverlay from './HeroOverlay';
import '@/styles/Admin/Hero/HeroEditor.css';

export default function HeroEditor() {
    return (
        <>
            <main className="heroEditorBody">
                <div className="heroEditorHeader">
                    <div>
                        <div className="heroEditorEyebrow">Editing</div>
                        <h1 className="heroEditorHeading">Hero Section</h1>
                        <p className="heroEditorSub">Changes here will update the hero section on your homepage.</p>
                    </div>
                    <div className="heroEditorHeaderActions">
                        <button className="heroEditorBtnGhost">Discard</button>
                        <button className="heroEditorBtnPrimary">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Save Changes
                        </button>
                    </div>
                </div>

                <div className="heroEditorGrid">
                    <div className="heroEditorLeft">
                        <HeroImageUpload />
                        <HeroOverlay />
                    </div>
                    <div className="heroEditorRight">
                        <HeroTextFields />
                        <HeroButtonFields />
                    </div>
                </div>

            </main>
        </>
    );
}