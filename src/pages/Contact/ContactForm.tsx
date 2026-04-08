import '../../styles/Contact/ContactForm.css'
import Mainbutton from '@/Components/Mainbutton'
import { FaTelegramPlane, FaInstagram, FaPhone } from 'react-icons/fa'
import Link from 'next/link'

export default function ContactForm() {
    return (
        <main className="contact-form-main">
            <section className="contact-form-wrapper">

                {/* ── Left: Form ── */}
                <div className="contact-form-left">
                    <div className="contact-form-row">
                        <div className="contact-form-group">
                            <label>First name<span className="required">*</span></label>
                            <input type="text" placeholder="First name" />
                        </div>
                        <div className="contact-form-group">
                            <label>Last name</label>
                            <input type="text" placeholder="Last name" />
                        </div>
                    </div>

                    <div className="contact-form-group">
                        <label>Email<span className="required">*</span></label>
                        <input type="email" placeholder="you@example.com" />
                    </div>

                    <div className="contact-form-group">
                        <label>Phone number<span className="required">*</span></label>
                        <input type="tel" placeholder="0416 684 156" />
                    </div>

                    <div className="contact-form-group">
                        <label>Message</label>
                        <textarea placeholder="Any messages...." rows={5} />
                    </div>

                    <div className="contact-form-submit">
                        <Mainbutton
                            data="Submit"
                            href=""
                            fontSize="clamp(16px, 1.5vw, 20px)"
                            padding="clamp(5px, 0.4vw, 7px) clamp(5px, 0.4vw, 7px) clamp(5px, 0.4vw, 7px) clamp(18px, 1.5vw, 24px)"
                            arrowSize="clamp(36px, 3.5vw, 48px)"
                        />
                    </div>
                </div>

                {/* ── Right: Info ── */}
                <div className="contact-form-right">
                    <div className="contact-info-block">
                        <h3>Chat with us.</h3>
                        <p>Speak to us via live chat.</p>
                        <div className="contact-info-links">
                            <Link href="mailto:info@rtctiling.com.au" className="contact-info-link">
                                <FaTelegramPlane />
                                <span>Shoot us an Email</span>
                            </Link>
                            <Link href="https://instagram.com" className="contact-info-link">
                                <FaInstagram />
                                <span>Message us on Instagram</span>
                            </Link>
                        </div>
                    </div>

                    <div className="contact-info-block">
                        <h3>Call us</h3>
                        <p>We&apos;re here to help you.</p>
                        <div className="contact-info-links">
                            <Link href="tel:0415456215" className="contact-info-link">
                                <FaPhone />
                                <span>0415 456 215</span>
                            </Link>
                            <Link href="tel:0446642345" className="contact-info-link">
                                <FaPhone />
                                <span>0446 642 345</span>
                            </Link>
                        </div>
                    </div>

                    <div className="contact-info-block">
                        <h3>Working hours</h3>
                        <p>Monday — Saturday: 7:00 AM — 6:00 PM</p>
                    </div>
                </div>

            </section>
        </main>
    )
}