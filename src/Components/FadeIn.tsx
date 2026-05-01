'use client';

import { ElementType, useLayoutEffect, useRef } from 'react';
import gsap from 'lib/gsap';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  as?: ElementType;
}

export default function FadeIn({
  children,
  className = '',
  delay = 0,
  y = 30,
  duration = 0.8,
  as: Tag = 'div',
}: FadeInProps) {

  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {

      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay: delay / 1000,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );

    }, ref);

    return () => ctx.revert();

  }, [delay, y, duration]);

  return (
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}