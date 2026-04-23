'use client';

import { useEffect, useRef, useState } from 'react';
import '../styles/CountUp.css';

interface CountUpProps {
    value: number;
    symbol?: string;
    label?: string;
    duration?: number;
    fontSize?: string;
    symbolSize?: string;
    labelSize?: string;
}

function CountUp({
    value,
    symbol = '',
    label = '',
    duration = 2000,
    fontSize,
    symbolSize,
    labelSize,
}: CountUpProps) {
    const [count, setCount] = useState(0);
    const [animated, setAnimated] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !animated) {
                    setAnimated(true);

                    let start = 0;
                    const increment = value / (duration / 30);

                    const interval = setInterval(() => {
                        start += increment;
                        if (start >= value) {
                            start = value;
                            clearInterval(interval);
                        }
                        setCount(Math.floor(start));
                    }, 30);

                    observer.disconnect();
                }
            },
            { threshold: 0, rootMargin: '0px 0px -50px 0px' }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [value, duration, animated]);

    return (
        <div className="countup-wrapper" ref={ref}>
            <div className="countup-number-row">
                <span
                    className="countup-number"
                    style={fontSize ? { fontSize } : undefined}
                >
                    {count}
                </span>
                {symbol && (
                    <span
                        className="countup-symbol"
                        style={symbolSize ? { fontSize: symbolSize } : undefined}
                    >
                        {symbol}
                    </span>
                )}
            </div>
            {label && (
                <p
                    className="countup-label"
                    style={labelSize ? { fontSize: labelSize } : undefined}
                >
                    {label}
                </p>
            )}
        </div>
    );
}

export default CountUp;