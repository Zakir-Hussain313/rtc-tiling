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

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
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
    const activeIndex = links.findIndex((l) => l.href === pathname);
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
        <div className="logo">
          <Image src={rtc} alt="RTC tiling" />
        </div>

        <nav
          className="nav-pill"
          ref={navPillRef}
          onMouseLeave={() => {
            const activeIndex = links.findIndex((l) => l.href === pathname);
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
              className={pathname === link.href ? "active" : ""}
              onMouseEnter={() => moveIndicatorTo(linkRefs.current[i])}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-cta">
          <Mainbutton data={"Get a free Quote"} />
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
        <div className="menu-links">
          {links.map((link) => (
            <Link key={link.href} className="m-links" href={link.href} onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
          <span onClick={closeMenu}>
            <Mainbutton data="About Us" href="/about" />
          </span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;