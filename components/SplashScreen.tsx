"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Star {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

export default function SplashScreen() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"stars" | "title" | "subtitle" | "enter">("stars");
  const animFrameRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);

  // Generate falling stars
  useEffect(() => {
    starsRef.current = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 2000,
      duration: Math.random() * 2000 + 2000,
      opacity: Math.random() * 0.6 + 0.4,
    }));
  }, []);

  // Canvas particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      decay: number;
      color: string;
    }

    const particles: Particle[] = [];
    const colors = ["#c9a84c", "#e8c97a", "#fff8e7", "#f0d080", "#ffffff"];

    // Spawn particles continuously
    const spawnParticle = () => {
      particles.push({
        x: Math.random() * width,
        y: -10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 2 + 1,
        size: Math.random() * 2.5 + 0.5,
        alpha: 1,
        decay: Math.random() * 0.005 + 0.003,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    let lastSpawn = 0;
    let running = true;

    const draw = (timestamp: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      if (timestamp - lastSpawn > 30) {
        spawnParticle();
        lastSpawn = timestamp;
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > height + 10) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        // Draw 4-pointed star shape
        ctx.beginPath();
        const s = p.size;
        ctx.moveTo(p.x, p.y - s);
        ctx.lineTo(p.x + s * 0.3, p.y - s * 0.3);
        ctx.lineTo(p.x + s, p.y);
        ctx.lineTo(p.x + s * 0.3, p.y + s * 0.3);
        ctx.lineTo(p.x, p.y + s);
        ctx.lineTo(p.x - s * 0.3, p.y + s * 0.3);
        ctx.lineTo(p.x - s, p.y);
        ctx.lineTo(p.x - s * 0.3, p.y - s * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Phase transitions
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("title"), 800);
    const t2 = setTimeout(() => setPhase("subtitle"), 2000);
    const t3 = setTimeout(() => setPhase("enter"), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleEnter = () => {
    router.push("/catalog");
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ background: "radial-gradient(ellipse at center, #0d0d0d 0%, #000000 100%)" }}
    >
      {/* Canvas for particle stars */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Background twinkling stars (CSS) */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        {starsRef.current.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${Math.random() * 100}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: "#c9a84c",
              opacity: star.opacity,
              animation: `twinkle ${star.duration}ms ${star.delay}ms ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center justify-center px-4 text-center" style={{ zIndex: 10 }}>

        {/* Top decorative line */}
        <div
          className="mb-8"
          style={{
            opacity: phase === "title" || phase === "subtitle" || phase === "enter" ? 1 : 0,
            transform: phase === "title" || phase === "subtitle" || phase === "enter" ? "scaleX(1)" : "scaleX(0)",
            transition: "opacity 1.2s ease, transform 1.2s ease",
            width: "200px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
          }}
        />

        {/* Brand Name */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(4rem, 14vw, 10rem)",
            fontWeight: 300,
            letterSpacing: "0.3em",
            lineHeight: 1,
            opacity: phase === "title" || phase === "subtitle" || phase === "enter" ? 1 : 0,
            transform: phase === "title" || phase === "subtitle" || phase === "enter" ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
            transition: "opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1), transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
            background: "linear-gradient(135deg, #9a7a30 0%, #c9a84c 30%, #e8c97a 50%, #c9a84c 70%, #9a7a30 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: phase !== "stars" ? "shimmer 4s linear infinite" : "none",
          }}
        >
          GRINALDI
        </h1>

        {/* Subtitle */}
        <div
          style={{
            opacity: phase === "subtitle" || phase === "enter" ? 1 : 0,
            transform: phase === "subtitle" || phase === "enter" ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 1s ease 0.2s, transform 1s ease 0.2s",
          }}
        >
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "clamp(0.65rem, 2.5vw, 0.85rem)",
              fontWeight: 400,
              letterSpacing: "0.5em",
              color: "#888880",
              textTransform: "uppercase",
              marginTop: "0.5rem",
            }}
          >
            FASHION HOUSE
          </p>
        </div>

        {/* Bottom decorative line */}
        <div
          style={{
            opacity: phase === "subtitle" || phase === "enter" ? 1 : 0,
            transform: phase === "subtitle" || phase === "enter" ? "scaleX(1)" : "scaleX(0)",
            transition: "opacity 1s ease 0.4s, transform 1s ease 0.4s",
            width: "200px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
            marginTop: "1.5rem",
            marginBottom: "3rem",
          }}
        />

        {/* Enter button */}
        <div
          style={{
            opacity: phase === "enter" ? 1 : 0,
            transform: phase === "enter" ? "translateY(0)" : "translateY(15px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
            marginTop: "1rem",
          }}
        >
          <button
            onClick={handleEnter}
            className="btn-gold group"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.35em",
              padding: "0.9rem 3rem",
              border: "1px solid #c9a84c",
              color: "#c9a84c",
              background: "transparent",
              cursor: "pointer",
              textTransform: "uppercase",
              transition: "all 0.4s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = "#c9a84c";
              (e.target as HTMLButtonElement).style.color = "#0a0a0a";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = "transparent";
              (e.target as HTMLButtonElement).style.color = "#c9a84c";
            }}
          >
            ENTER COLLECTION
          </button>
        </div>

        {/* Skip hint */}
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            color: "#444440",
            marginTop: "2.5rem",
            opacity: phase === "enter" ? 1 : 0,
            transition: "opacity 1s ease 0.5s",
          }}
        >
          ✦ HAUTE COUTURE ✦
        </p>
      </div>
    </div>
  );
}
