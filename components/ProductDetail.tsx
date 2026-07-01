"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";

interface ProductDetailProps {
  product: Product;
  backHref: string;
  backLabel: string;
}

export default function ProductDetail({ product, backHref, backLabel }: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const hasImage = (index: number) =>
    product.images[index] && !imageError[index];

  return (
    <main style={{ paddingTop: "100px", paddingBottom: "80px" }}>
      {/* Breadcrumb */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "1.5rem 2rem",
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        <Link
          href="/catalog"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            color: "#888880",
            textDecoration: "none",
            textTransform: "uppercase",
          }}
        >
          COLLECTIONS
        </Link>
        <span style={{ color: "#333330", fontSize: "0.65rem" }}>/</span>
        <Link
          href={backHref}
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            color: "#888880",
            textDecoration: "none",
            textTransform: "uppercase",
          }}
        >
          {backLabel}
        </Link>
        <span style={{ color: "#333330", fontSize: "0.65rem" }}>/</span>
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            color: "#c9a84c",
            textTransform: "uppercase",
          }}
        >
          {product.name}
        </span>
      </div>

      {/* Product layout */}
      <section
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 2rem 4rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "start",
        }}
        className="product-detail-grid"
      >
        {/* Images */}
        <div>
          {/* Main image */}
          <div
            style={{
              position: "relative",
              aspectRatio: "3/4",
              background: "#111111",
              marginBottom: "1rem",
              overflow: "hidden",
            }}
          >
            {hasImage(activeImage) ? (
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                onError={() => setImageError((prev) => ({ ...prev, [activeImage]: true }))}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <PlaceholderDetail category={product.category} />
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  style={{
                    width: "70px",
                    height: "90px",
                    position: "relative",
                    overflow: "hidden",
                    border: i === activeImage ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    padding: 0,
                    background: "#111",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  {!imageError[i] ? (
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      onError={() => setImageError((prev) => ({ ...prev, [i]: true }))}
                      sizes="70px"
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "#1a1a1a" }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ paddingTop: "1rem" }}>
          {/* Category tag */}
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              color: product.category === "wedding" ? "#c9a84c" : "#888880",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            {product.category === "wedding" ? "✦ BRIDAL COUTURE" : "WOMEN'S FASHION"}
          </p>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 300,
              letterSpacing: "0.05em",
              color: "#f5f5f0",
              margin: "0 0 1.5rem",
              lineHeight: 1.1,
            }}
          >
            {product.name}
          </h1>

          {/* Divider */}
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "linear-gradient(90deg, #c9a84c, transparent)",
              marginBottom: "1.5rem",
            }}
          />

          {/* Price */}
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2rem",
              fontWeight: 400,
              color: "#c9a84c",
              letterSpacing: "0.05em",
              marginBottom: "2rem",
            }}
          >
            € {product.price.toLocaleString("en-EU")}
          </p>

          {/* Description */}
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 300,
              lineHeight: 2,
              color: "#888880",
              marginBottom: "2.5rem",
            }}
          >
            {product.description}
          </p>

          {/* Details */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.05)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              padding: "1.5rem 0",
              marginBottom: "2.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {[
              { label: "Category", value: product.category === "wedding" ? "Bridal Couture" : "Women's Fashion" },
              { label: "Collection", value: "Grinaldi Fashion House" },
              { label: "Availability", value: "Made to Order" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    color: "#555550",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.75rem",
                    color: "#888880",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <button className="btn-gold-solid" style={{ width: "100%", textAlign: "center" }}>
              REQUEST CONSULTATION
            </button>
            <Link
              href={backHref}
              className="btn-gold"
              style={{ textDecoration: "none", textAlign: "center" }}
            >
              ← BACK TO {backLabel}
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </main>
  );
}

function PlaceholderDetail({ category }: { category: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #1a1a1a, #222222, #1a1a1a)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
      }}
    >
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.5rem",
          color: "#333330",
          letterSpacing: "0.1em",
        }}
      >
        {category === "wedding" ? "Bridal Gown" : "Fashion Piece"}
      </p>
      <p
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "0.65rem",
          color: "#2a2a28",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        Image pending
      </p>
    </div>
  );
}
