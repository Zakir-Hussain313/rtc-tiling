'use client'
import { useEffect, useRef, useState } from "react";
import "../styles/NumBox.css";

interface Stat {
  value: number;
  symbol: string;
  label: string;
}

function NumBox() {
  const [statsData, setStatsData] = useState<Stat[]>([]);
  const [counts, setCounts] = useState<number[]>([]);
  const [animated, setAnimated] = useState(false);
  const [loading, setLoading] = useState(true);

  const statsRef = useRef<HTMLDivElement | null>(null);

  // ✅ FETCH FROM API
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();

        if (res.ok && data.data?.stats) {
          const formatted = data.data.stats.map((s: any) => ({
            value: Number(s.value),
            symbol: s.suffix,
            label: s.label,
          }));

          setStatsData(formatted);
          setCounts(formatted.map(() => 0));
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  // ✅ ANIMATION
  useEffect(() => {
    if (!statsData.length) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);

          statsData.forEach((stat, index) => {
            let start = 0;
            const duration = 2000;
            const increment = stat.value / (duration / 30);

            const interval = setInterval(() => {
              start += increment;

              if (start >= stat.value) {
                start = stat.value;
                clearInterval(interval);
              }

              setCounts((prev) => {
                const updated = [...prev];
                updated[index] = Math.floor(start);
                return updated;
              });
            }, 30);
          });

          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -50px 0px" }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [statsData, animated]);

  if (loading) return null;

  return (
    <main className="stats-container" ref={statsRef}>
      {statsData.map((stat, i) => (
        <section className="stats" key={i}>
          <div className="stats-up">
            <h1>{counts[i]}</h1>
            <span>{stat.symbol}</span>
          </div>
          <div className="stats-down">
            <h1>{stat.label}</h1>
          </div>
        </section>
      ))}
    </main>
  );
}

export default NumBox;