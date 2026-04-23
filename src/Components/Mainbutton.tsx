'use client';

import Link from "next/link";
import Image from "next/image";
import arrow from "../assets/icons/Arrow.svg";
import "../styles/Mainbutton.css";
import { useRef } from "react";

type MainbuttonProps = {
  data: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  arrowColor?: string;
  href?: string;
  padding?: string;
  arrowSize?: string;
  arrowImageSize?: string;
  border?: string;
  hoverBubbleColor?: string;
  hoverTextColor?: string;
};

function Mainbutton({
  data,
  backgroundColor,
  textColor,
  fontSize,
  arrowColor,
  href = "",
  padding,
  arrowSize,
  arrowImageSize,
  border,
  hoverBubbleColor = "#c4a473",
  hoverTextColor,
}: MainbuttonProps) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);

  function getEntryPoint(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = btnRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  }

  function handleMouseEnter(e: React.MouseEvent<HTMLAnchorElement>) {
    const { x, y } = getEntryPoint(e);
    const bubble = bubbleRef.current;
    const btn = btnRef.current;
    if (!bubble || !btn) return;

    const size = Math.max(btn.offsetWidth, btn.offsetHeight) * 2.5;

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${x - size / 2}px`;
    bubble.style.top = `${y - size / 2}px`;
    bubble.style.transition = 'none';
    bubble.style.transform = 'scale(0)';
    // 👇 always fully visible, no opacity tricks
    bubble.style.opacity = '1';

    bubble.getBoundingClientRect();

    // 👇 faster: 0.35s instead of 0.55s
    bubble.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    bubble.style.transform = 'scale(1)';

    if (hoverTextColor && btn) {
      btn.style.color = hoverTextColor;
    }
  }

  function handleMouseLeave(e: React.MouseEvent<HTMLAnchorElement>) {
    const { x, y } = getEntryPoint(e);
    const bubble = bubbleRef.current;
    const btn = btnRef.current;
    if (!bubble || !btn) return;

    const size = Math.max(btn.offsetWidth, btn.offsetHeight) * 2.5;

    bubble.style.left = `${x - size / 2}px`;
    bubble.style.top = `${y - size / 2}px`;
    // 👇 faster exit: 0.3s, no opacity transition
    bubble.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    bubble.style.transform = 'scale(0)';

    if (hoverTextColor && btn) {
      btn.style.color = '';
    }
  }

  return (
    <Link
      ref={btnRef}
      href={href}
      className="main-button"
      style={{
        "--btn-bg": backgroundColor,
        "--btn-color": textColor,
        "--btn-font-size": fontSize,
        "--btn-padding": padding,
        "--btn-arrow-bg": arrowColor,
        "--btn-arrow-size": arrowSize,
        "--btn-arrow-image-size": arrowImageSize,
        "--btn-border": border,
        "--btn-bubble-color": hoverBubbleColor,
      } as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="btn-bubble" ref={bubbleRef} />
      <span className="btn-label">{data}</span>
      <span className="arrow">
        <span className="arrow-inner">
          <Image src={arrow} alt="arrow" />
        </span>
      </span>
    </Link>
  );
}

export default Mainbutton;