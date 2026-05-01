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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pathname = usePathname();
  const navPillRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

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

  const activeIndex = links.findIndex((l) => isActiveLink(l.href, pathname));

  const getLinkColor = (i: number) => {
    if (hoveredIndex !== null) {
      return i === hoveredIndex ? "#111" : "#fff";
    }
    return i === activeIndex ? "#111" : "#fff";
  };

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
            setHoveredIndex(null);
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
              style={{
                color: getLinkColor(i),
                transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={() => {
                setHoveredIndex(i);
                moveIndicatorTo(linkRefs.current[i]);
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