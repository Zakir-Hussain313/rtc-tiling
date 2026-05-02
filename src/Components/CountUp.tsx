'use client';

import { useEffect, useRef, useState } from 'react';
import '../styles/CountUp.css';

interface CountUpProps {
    statIndex?: number;   // 0-3, fetches from API
    value?: number;       // fallback if no statIndex
    symbol?: string;
    label?: string;
    duration?: number;
    fontSize?: string;
    symbolSize?: string;
    labelSize?: string;
}

function CountUp({
    statIndex,
    value: valueProp,
    symbol: symbolProp = '',
    label: labelProp = '',
    duration = 2000,
    fontSize,
    symbolSize,
    labelSize,
}: CountUpProps) {
    const [value, setValue] = useState(valueProp ?? 0);
    const [symbol, setSymbol] = useState(symbolProp);
    const [label, setLabel] = useState(labelProp);
    const [count, setCount] = useState(0);
    const [animated, setAnimated] = useState(false);
    const [ready, setReady] = useState(statIndex === undefined);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (statIndex === undefined) return;
        const index = statIndex;
        async function fetchStat() {
            try {
                const res = await fetch('/api/stats');
                const data = await res.json();
                const stat = data.data?.stats?.[index];
                if (stat) {
                    setValue(Number(stat.value));
                    setSymbol(stat.suffix);
                    setLabel(stat.label);
                }
            } catch (err) {
                console.error('CountUp: failed to fetch stat', err);
            } finally {
                setReady(true);
            }
        }
        fetchStat();
    }, [statIndex]);

    useEffect(() => {
        if (!ready) return;

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
    }, [value, duration, animated, ready]);

    if (!ready) return null;

    return (
        <div className="countup-wrapper" ref={ref}>
            <div className="countup-number-row">
                <span className="countup-number" style={fontSize ? { fontSize } : undefined}>
                    {count}
                </span>
                {symbol && (
                    <span className="countup-symbol" style={symbolSize ? { fontSize: symbolSize } : undefined}>
                        {symbol}
                    </span>
                )}
            </div>
            {label && (
                <p className="countup-label" style={labelSize ? { fontSize: labelSize } : undefined}>
                    {label}
                </p>
            )}
        </div>
    );
}

export default CountUp;