
import '../../styles/Contact/Contact.css'
import ContactCTA from './ContactCTA'
import ContactForm from './ContactForm'
import ContactPageIntro from './PageIntro'

export default function Contact(){
    return (
        <main className="contact-main-section">
            <ContactPageIntro />
            <ContactForm />
            <ContactCTA />
        </main>
    )
}