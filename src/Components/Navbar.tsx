"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const pathname = usePathname();
  const navPillRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const hoveredRef = useRef<number | null>(null);

  const moveIndicatorTo = (el: HTMLAnchorElement | null) => {
    if (!el || !navPillRef.current) return;
    const pillRect = navPillRef.current.getBoundingClientRect();
    const linkRect = el.getBoundingClientRect();
    setIndicatorStyle({
      left: linkRect.left - pillRect.left,
      width: linkRect.width,
    });
  };

  useEffect(() => {
    const activeIndex = links.findIndex((l) => isActiveLink(l.href, pathname));
    const index = activeIndex !== -1 ? activeIndex : 0;
    moveIndicatorTo(linkRefs.current[index]);
  }, [pathname]);

  const handleClick = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href={'/'} className="logo" onClick={closeMenu}>
          <Image src={rtc} alt="RTC tiling" />
        </Link>

        <nav
          className="nav-pill"
          ref={navPillRef}
          onMouseLeave={() => {
            linkRefs.current.forEach(l => l?.classList.remove('hovered'));
            hoveredRef.current = null;
            const activeIndex = links.findIndex((l) => isActiveLink(l.href, pathname));
            const index = activeIndex !== -1 ? activeIndex : 0;
            moveIndicatorTo(linkRefs.current[index]);
          }}
        >
          <div
            className="nav-indicator"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
          />
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              ref={(el) => { linkRefs.current[i] = el; }}
              className={isActiveLink(link.href, pathname) ? "active" : ""}
              onMouseEnter={() => {
                linkRefs.current.forEach(l => l?.classList.remove('hovered'));
                linkRefs.current[i]?.classList.add('hovered');
                hoveredRef.current = i;
                moveIndicatorTo(linkRefs.current[i]);
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-cta">
          <Mainbutton data={"Get a free Quote"} href="/contact" hoverBubbleColor="#4d3d2d" />
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
        <Link href={'/'} className="menu-logo" onClick={closeMenu}>
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
            <Mainbutton data={"Get a free Quote"} href="/contact" hoverBubbleColor="#4d3d2d" />
          </span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;