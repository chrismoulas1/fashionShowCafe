"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.5rem",
              fontWeight: 300,
              letterSpacing: "0.3em",
              color: "#c9a84c",
              marginBottom: "0.25rem",
            }}
          >
            GRINALDI
          </p>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              color: "#444440",
              textTransform: "uppercase",
            }}
          >
            Administration
          </p>
          <div
            style={{
              width: "60px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
              margin: "1.5rem auto 0",
            }}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: "#888880",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              style={{
                width: "100%",
                background: "#111111",
                border: "1px solid rgba(201,168,76,0.2)",
                color: "#f5f5f0",
                padding: "0.875rem 1rem",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.85rem",
                outline: "none",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.2)")}
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: "#888880",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: "100%",
                background: "#111111",
                border: "1px solid rgba(201,168,76,0.2)",
                color: "#f5f5f0",
                padding: "0.875rem 1rem",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.85rem",
                outline: "none",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.2)")}
            />
          </div>

          {error && (
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.75rem",
                color: "#e05050",
                textAlign: "center",
                marginBottom: "1.25rem",
                padding: "0.75rem",
                background: "rgba(224,80,80,0.08)",
                border: "1px solid rgba(224,80,80,0.2)",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold-solid"
            style={{
              width: "100%",
              textAlign: "center",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          <a
            href="/catalog"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              color: "#444440",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            ← Back to Catalogue
          </a>
        </p>
      </div>
    </div>
  );
}
