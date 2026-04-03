'use client'
import { useEffect, useRef, useState } from "react";
import "../styles/NumBox.css";

interface Stat {
  value: number;
  symbol: string;
  label: string;
}

const statsData: Stat[] = [
  { value: 99, symbol: "+", label: "Projects Completed" },
  { value: 10, symbol: "+", label: "Team Members" },
  { value: 92, symbol: "%", label: "Client Retention" },
  { value: 80, symbol: "+", label: "Successful Launches" },
];

function NumBox() {
  const [counts, setCounts] = useState(statsData.map(() => 0));
  const statsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          statsData.forEach((stat, index) => {
            let start = 0;
            const duration = 2000; // 2 seconds
            const increment = stat.value / (duration / 30); // 30ms interval
            const interval = setInterval(() => {
              start += increment;
              if (start >= stat.value) {
                start = stat.value;
                clearInterval(interval);
              }
              setCounts((prev) => {
                const newCounts = [...prev];
                newCounts[index] = Math.floor(start);
                return newCounts;
              });
            }, 30);
          });
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
  }, []);

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