'use client'

import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import '../../styles/Contact/ContactForm.css'
import Mainbutton from '@/Components/Mainbutton'
import { FaTelegramPlane, FaInstagram, FaPhone } from 'react-icons/fa'
import Link from 'next/link'
import FadeIn from '@/Components/FadeIn'

// ── Replace these with your real EmailJS credentials ──────────────
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'
// ──────────────────────────────────────────────────────────────────

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ContactForm() {
    const formRef = useRef<HTMLFormElement>(null)
    const [status, setStatus] = useState<Status>('idle')
    const [fields, setFields] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
    })

    const disabled = status === 'sending' || status === 'success'

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFields(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async () => {
        if (disabled) return
        if (!fields.firstName || !fields.email || !fields.phone) return

        setStatus('sending')

        try {
            await emailjs.sendForm(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                formRef.current!,
                EMAILJS_PUBLIC_KEY
            )
            setStatus('success')
        } catch (err) {
            console.error('[ContactForm] EmailJS error:', err)
            setStatus('error')
        }
    }

    return (
        <main className="contact-form-main">
            <FadeIn as="section" className="contact-form-wrapper" delay={100}>

                {/* ── Left: Form ── */}
                <form className="contact-form-left" ref={formRef} noValidate>

                    <div className="contact-form-row">
                        <div className="contact-form-group">
                            <label htmlFor="firstName">
                                First name<span className="required">*</span>
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="First name"
                                value={fields.firstName}
                                onChange={handleChange}
                                disabled={disabled}
                            />
                        </div>
                        <div className="contact-form-group">
                            <label htmlFor="lastName">Last name</label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Last name"
                                value={fields.lastName}
                                onChange={handleChange}
                                disabled={disabled}
                            />
                        </div>
                    </div>

                    <div className="contact-form-group">
                        <label htmlFor="email">
                            Email<span className="required">*</span>
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={fields.email}
                            onChange={handleChange}
                            disabled={disabled}
                        />
                    </div>

                    <div className="contact-form-group">
                        <label htmlFor="phone">
                            Phone number<span className="required">*</span>
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="0416 684 156"
                            value={fields.phone}
                            onChange={handleChange}
                            disabled={disabled}
                        />
                    </div>

                    <div className="contact-form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            placeholder="Any messages...."
                            rows={5}
                            value={fields.message}
                            onChange={handleChange}
                            disabled={disabled}
                        />
                    </div>

                    <div className="contact-form-submit">
                        <div className="contact-submit-wrap">

                            {status !== 'success' && (
                                <div
                                    className={`cf-mainbutton-wrap${disabled ? ' cf-mainbutton-wrap--disabled' : ''}`}
                                    onClick={handleSubmit}
                                >
                                    <Mainbutton
                                        data={status === 'sending' ? 'Sending…' : 'Submit'}
                                        href=""
                                        fontSize="clamp(20px, 1.5vw, 25px)"
                                        padding="clamp(5px, 0.5vw, 7px) clamp(5px, 0.4vw, 7px) clamp(5px, 0.4vw, 7px) clamp(18px, 1.5vw, 24px)"
                                        arrowSize="clamp(36px, 3.5vw, 48px)"
                                        hoverBubbleColor="#4d3d2d"
                                    />
                                </div>
                            )}

                            {status === 'success' && (
                                <>
                                    <div className="cf-status cf-status--success">
                                        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span>Message sent!</span>
                                    </div>
                                    <p className="cf-reassurance">
                                        We&apos;ll get back to you within 24 hours 🤝
                                    </p>
                                </>
                            )}

                            {status === 'error' && (
                                <div className="cf-status cf-status--error">
                                    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    <span>Something went wrong. Please try again or call us directly.</span>
                                </div>
                            )}

                        </div>
                    </div>
                </form>

                {/* ── Right: Info ── */}
                <FadeIn as="div" className="contact-form-right" delay={300}>
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
                </FadeIn>
            </FadeIn>
        </main>
    )
}