import ProjectsPageIntro from "./PageIntro";
import '../../styles/Projects/Projects.css'
import ProjectsListing from "./ProjectsListing";

export default function Projects() {
    return (
        <main className="projects-main-section">
           <ProjectsPageIntro />
           <ProjectsListing />
        </main>
    )
}