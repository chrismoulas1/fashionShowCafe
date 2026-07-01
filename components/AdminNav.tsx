"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const links = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/products/new", label: "+ New Product" },
  ];

  return (
    <header
      style={{
        background: "#111111",
        borderBottom: "1px solid rgba(201,168,76,0.15)",
        padding: "0.875rem 2rem",
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
      }}
    >
      {/* Logo */}
      <Link
        href="/admin/dashboard"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.3rem",
          fontWeight: 300,
          letterSpacing: "0.2em",
          color: "#c9a84c",
          textDecoration: "none",
        }}
      >
        GRINALDI
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.55rem",
            letterSpacing: "0.15em",
            color: "#555550",
            marginLeft: "0.75rem",
            verticalAlign: "middle",
          }}
        >
          ADMIN
        </span>
      </Link>

      {/* Nav links */}
      <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              color: pathname === href || pathname.startsWith(href + "/") ? "#c9a84c" : "#888880",
              textDecoration: "none",
              textTransform: "uppercase",
              transition: "color 0.2s ease",
            }}
          >
            {label}
          </Link>
        ))}

        <Link
          href="/catalog"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            color: "#555550",
            textDecoration: "none",
            textTransform: "uppercase",
          }}
        >
          View Site ↗
        </Link>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            color: "#444440",
            background: "none",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "0.35rem 0.75rem",
            cursor: "pointer",
            textTransform: "uppercase",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.borderColor = "rgba(224,80,80,0.4)";
            (e.target as HTMLButtonElement).style.color = "#e05050";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
            (e.target as HTMLButtonElement).style.color = "#444440";
          }}
        >
          {loggingOut ? "..." : "Logout"}
        </button>
      </nav>
    </header>
  );
}
