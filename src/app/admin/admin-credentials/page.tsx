'use client';

import { useState } from 'react';
import './AdminCredentials.css';

type Status = 'idle' | 'loading' | 'success' | 'error';

function EyeIcon({ visible }: { visible: boolean }) {
    return visible ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

export default function AdminCredentialsPage() {
    const [fields, setFields] = useState({
        currentPassword: '',
        newUsername: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [show, setShow] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleShow = (field: keyof typeof show) => {
        setShow(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async () => {
        setError('');

        if (!fields.currentPassword || !fields.newPassword || !fields.confirmPassword) {
            setError('Current password, new password and confirmation are required.');
            return;
        }

        if (fields.newPassword !== fields.confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        if (fields.newPassword.length < 6) {
            setError('New password must be at least 6 characters.');
            return;
        }

        setStatus('loading');

        try {
            const res = await fetch('/api/auth/change-credentials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    currentPassword: fields.currentPassword,
                    newUsername: fields.newUsername.trim() || undefined,
                    newPassword: fields.newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong.');
                setStatus('error');
                return;
            }

            setStatus('success');
            setFields({
                currentPassword: '',
                newUsername: '',
                newPassword: '',
                confirmPassword: '',
            });

        } catch {
            setError('Something went wrong.');
            setStatus('error');
        }
    };

    const disabled = status === 'loading' || status === 'success';

    return (
        <main className="credBody">
            <div className="credHeader">
                <div>
                    <div className="credEyebrow">Admin</div>
                    <h1 className="credHeading">Change Credentials</h1>
                    <p className="credSub">Update your login username and password.</p>
                </div>
            </div>

            <div className="credCard">
                <div className="credCardHeader">
                    <div className="credCardIcon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                    </div>
                    <div>
                        <div className="credCardTitle">Account Details</div>
                        <div className="credCardSub">Changes take effect immediately after saving.</div>
                    </div>
                </div>

                <div className="credDivider" />

                <div className="credFields">

                    {/* Current Password */}
                    <div className="credField">
                        <label className="credLabel" htmlFor="currentPassword">Current Password</label>
                        <div className="credInputWrap">
                            <input
                                id="currentPassword"
                                name="currentPassword"
                                type={show.currentPassword ? 'text' : 'password'}
                                className="credInput"
                                placeholder="Enter your current password"
                                value={fields.currentPassword}
                                onChange={handleChange}
                                disabled={disabled}
                            />
                            <button type="button" className="credEyeBtn" onClick={() => toggleShow('currentPassword')} tabIndex={-1}>
                                <EyeIcon visible={show.currentPassword} />
                            </button>
                        </div>
                    </div>

                    <div className="credDivider" />

                    {/* New Username - optional */}
                    <div className="credField">
                        <label className="credLabel" htmlFor="newUsername">
                            New Username <span className="credOptional">(optional)</span>
                        </label>
                        <input
                            id="newUsername"
                            name="newUsername"
                            type="text"
                            className="credInput"
                            placeholder="Leave blank to keep current username"
                            value={fields.newUsername}
                            onChange={handleChange}
                            disabled={disabled}
                        />
                    </div>

                    {/* New Password + Confirm */}
                    <div className="credGrid">
                        <div className="credField">
                            <label className="credLabel" htmlFor="newPassword">New Password</label>
                            <div className="credInputWrap">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={show.newPassword ? 'text' : 'password'}
                                    className="credInput"
                                    placeholder="Min. 6 characters"
                                    value={fields.newPassword}
                                    onChange={handleChange}
                                    disabled={disabled}
                                />
                                <button type="button" className="credEyeBtn" onClick={() => toggleShow('newPassword')} tabIndex={-1}>
                                    <EyeIcon visible={show.newPassword} />
                                </button>
                            </div>
                        </div>

                        <div className="credField">
                            <label className="credLabel" htmlFor="confirmPassword">Confirm New Password</label>
                            <div className="credInputWrap">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={show.confirmPassword ? 'text' : 'password'}
                                    className="credInput"
                                    placeholder="Repeat new password"
                                    value={fields.confirmPassword}
                                    onChange={handleChange}
                                    disabled={disabled}
                                />
                                <button type="button" className="credEyeBtn" onClick={() => toggleShow('confirmPassword')} tabIndex={-1}>
                                    <EyeIcon visible={show.confirmPassword} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="credError">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="credSuccess">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                            Credentials updated successfully.
                        </div>
                    )}
                </div>

                <div className="credFooter">
                    <button
                        className="credBtnPrimary"
                        onClick={handleSubmit}
                        disabled={disabled}
                    >
                        {status === 'loading' ? 'Saving…' : status === 'success' ? 'Saved ✓' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </main>
    );
}