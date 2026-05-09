"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import rtc from "../assets/images/Rtc.png";
import "../styles/Navbar.css";
import Mainbutton from "./Mainbutton";
import CrossIcon from "./CrossIcon";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

function isActiveLink(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pillReady, setPillReady] = useState(false);
  const pathname = usePathname();
  const navPillRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const activeIndex = links.findIndex((l) => isActiveLink(l.href, pathname));

  const snapPillInstant = useCallback(() => {
    const index = activeIndex !== -1 ? activeIndex : 0;
    const el = linkRefs.current[index];
    if (!el || !navPillRef.current || !pillRef.current) return;
    const navRect = navPillRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    if (elRect.width === 0) return; // not painted yet, skip
    gsap.set(pillRef.current, {
      left: elRect.left - navRect.left,
      width: elRect.width,
      height: elRect.height,
    });
    setPillReady(true);
  }, [activeIndex]);

  const movePill = useCallback((el: HTMLAnchorElement | null) => {
    if (!el || !navPillRef.current || !pillRef.current) return;
    const navRect = navPillRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    gsap.to(pillRef.current, {
      duration: 0.35,
      ease: "power3.inOut",
      left: elRect.left - navRect.left,
      width: elRect.width,
      height: elRect.height,
    });
  }, []);

  // Mount + route change — use ResizeObserver instead of setTimeout
  // fires exactly when the nav has real dimensions, works in SSR prod
  useEffect(() => {
    setPillReady(false);
    const nav = navPillRef.current;
    if (!nav) return;

    const observer = new ResizeObserver(() => {
      snapPillInstant();
    });
    observer.observe(nav);
    snapPillInstant(); // try immediately too

    return () => observer.disconnect();
  }, [pathname, snapPillInstant]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const index = activeIndex !== -1 ? activeIndex : 0;
      movePill(linkRefs.current[index]);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex, movePill]);

  // Body overflow lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  const getLinkColor = useCallback(
    (i: number) => {
      if (hoveredIndex !== null) {
        return i === hoveredIndex ? "#111" : "#cfcfcf";
      }
      return i === activeIndex ? "#111" : "#cfcfcf";
    },
    [hoveredIndex, activeIndex]
  );

  const handleClick = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href={"/"} className="logo" onClick={closeMenu}>
          <Image src={rtc} alt="RTC tiling" />
        </Link>

        <nav
          className="nav-pill"
          ref={navPillRef}
          onMouseLeave={() => {
            setHoveredIndex(null);
            const index = activeIndex !== -1 ? activeIndex : 0;
            movePill(linkRefs.current[index]);
          }}
        >
          <div
            ref={pillRef}
            className="nav-indicator"
            style={{ opacity: pillReady ? 1 : 0 }}
          />

          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              ref={(el) => { linkRefs.current[i] = el; }}
              className={isActiveLink(link.href, pathname) ? "active" : ""}
              style={{
                color: getLinkColor(i),
                transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={() => {
                setHoveredIndex(i);
                movePill(linkRefs.current[i]);
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-cta">
          <Mainbutton
            data={"Get a free Quote"}
            href="/contact"
            hoverBubbleColor="#ffffff"
            border="2px solid transparent"
            fontSize="clamp(15px, 2vw, 20px)"
            padding="5px 5px 5px 20px"
            borderOnHover="2px solid #444"
            arrowSize="clamp(38px, 4vw, 50px)"
            textColor="white"
            hoverTextColor="#111"
          />
        </div>

        <span className={`burger ${isOpen ? "open" : ""}`} onClick={handleClick}>
          {!isOpen ? (
            <span className="menu-text">Menu</span>
          ) : (
            <CrossIcon className="cross-icon" />
          )}
        </span>
      </div>

      <div className={`menu ${isOpen ? "" : "closed"}`}>
        <Link href={"/"} className="menu-logo" onClick={closeMenu}>
          <Image src={rtc} alt="RTC tiling" />
        </Link>

        <div className="menu-links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`m-links${isActiveLink(link.href, pathname) ? " active" : ""}`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          <span onClick={closeMenu}>
            <Mainbutton
              data={"Get a free Quote"}
              href="/contact"
              hoverBubbleColor="#4d3d2d"
              fontSize="clamp(15px, 2vw, 20px)"
              padding="5px 5px 5px 20px"
              arrowSize="clamp(38px, 4vw, 50px)"
              textColor="white"
            />
          </span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;