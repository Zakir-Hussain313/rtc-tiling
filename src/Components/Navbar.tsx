"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import rtc from "../assets/images/Rtc.png";
import "../styles/Navbar.css";
import Mainbutton from "./Mainbutton";
import CrossIcon from "./CrossIcon";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  /* ✅ NEW: close menu on link click */
  const closeMenu = () => {
    setIsOpen(false);
  };

  /* ✅ lock scroll when menu opens */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <div className="logo">
          <Image src={rtc} alt="RTC tiling" />
        </div>

        {/* Center Nav */}
        <nav className="nav-pill">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* CTA */}
        <div className="nav-cta">
          <Mainbutton data={"Get a free Quote"} />
        </div>

        {/* Burger */}
        <span
          className={`burger ${isOpen ? "open" : ""}`}
          onClick={handleClick}
        >
          {!isOpen ? (
            <span className="menu-text">Menu</span>
          ) : (
            <CrossIcon className="cross-icon" />
          )}
        </span>
      </div>

      {/* Mobile Menu */}
      <div className={`menu ${isOpen ? "" : "closed"}`}>
        <div className="menu-links">
          <Link className="m-links" href="/" onClick={closeMenu}>
            Home
          </Link>

          <Link className="m-links" href="/about" onClick={closeMenu}>
            About
          </Link>

          <Link className="m-links" href="/services" onClick={closeMenu}>
            Services
          </Link>

          <Link className="m-links" href="/projects" onClick={closeMenu}>
            Projects
          </Link>

          <Link className="m-links" href="/contact" onClick={closeMenu}>
            Contact
          </Link>

          <span onClick={closeMenu}>
            <Mainbutton data="About Us" href="/about" />
          </span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;