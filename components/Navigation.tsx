"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/catalog", label: "ALL COLLECTIONS" },
    { href: "/catalog/fashion", label: "FASHION" },
    { href: "/catalog/wedding", label: "BRIDAL" },
  ];

  const isActive = (href: string) =>
    href === "/catalog" ? pathname === "/catalog" : pathname.startsWith(href);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease",
        background: scrolled ? "rgba(10,10,10,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.2)" : "1px solid transparent",
        padding: scrolled ? "0.75rem 2rem" : "1.5rem 2rem",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link
          href="/catalog"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.6rem",
            fontWeight: 400,
            letterSpacing: "0.25em",
            color: "#c9a84c",
            textDecoration: "none",
            textTransform: "uppercase",
          }}
        >
          GRINALDI
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex" style={{ gap: "3rem", alignItems: "center" }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textDecoration: "none",
                color: isActive(link.href) ? "#c9a84c" : "#888880",
                transition: "color 0.3s ease",
                textTransform: "uppercase",
                borderBottom: isActive(link.href) ? "1px solid #c9a84c" : "1px solid transparent",
                paddingBottom: "2px",
              }}
              onMouseEnter={(e) => {
                if (!isActive(link.href)) (e.target as HTMLElement).style.color = "#f5f5f0";
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.href)) (e.target as HTMLElement).style.color = "#888880";
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            padding: "4px",
          }}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: "24px",
                height: "1px",
                background: "#c9a84c",
                transition: "transform 0.3s ease, opacity 0.3s ease",
                transform:
                  menuOpen && i === 0
                    ? "rotate(45deg) translate(4px, 4px)"
                    : menuOpen && i === 2
                    ? "rotate(-45deg) translate(4px, -4px)"
                    : menuOpen && i === 1
                    ? "opacity: 0"
                    : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: "rgba(10,10,10,0.98)",
            borderTop: "1px solid rgba(201,168,76,0.2)",
            padding: "1.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textDecoration: "none",
                color: isActive(link.href) ? "#c9a84c" : "#888880",
                textTransform: "uppercase",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
