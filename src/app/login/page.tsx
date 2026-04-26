'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './login.css';
import Image from 'next/image';
import logo from '../../assets/images/Rtc.png';

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Please enter username and password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // important for cookies
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // ✅ success
            router.push('/admin');

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="loginPage">
            <div className="loginCard">

                <div className="loginLogo">
                    <div className="loginLogoIcon">
                        <Image
                        src={logo}
                        alt='Logo'
                        fill
                        className='object-cover'
                        />
                    </div>
                    <div className="loginLogoText">Admin Logo</div>
                    <div className="loginLogoSub">RTC Tiling — Content Manager</div>
                </div>

                <form className="loginForm" onSubmit={handleSubmit} noValidate>

                    <div className="loginField">
                        <label className="loginLabel">Username</label>
                        <input
                            type="text"
                            className="loginInput"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="loginField">
                        <label className="loginLabel">Password</label>
                        <input
                            type="password"
                            className="loginInput"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {error && <div className="loginError">{error}</div>}

                    <button
                        type="submit"
                        className="loginSubmitBtn"
                        disabled={loading || !username || !password}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}