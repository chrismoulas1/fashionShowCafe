"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const displayImage =
    !imageError && product.images.length > 0
      ? product.images[0]
      : null;

  const categoryLabel = product.category === "wedding" ? "BRIDAL" : "FASHION";
  const categoryColor = product.category === "wedding" ? "#c9a84c" : "#888880";

  return (
    <Link
      href={`/catalog/${product.category}/${product.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <article
        className="product-card"
        style={{
          background: "#111111",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {/* Image container */}
        <div
          style={{
            position: "relative",
            aspectRatio: "3/4",
            background: "#1a1a1a",
            overflow: "hidden",
          }}
        >
          {displayImage ? (
            <Image
              src={displayImage}
              alt={product.name}
              fill
              style={{ objectFit: "cover", transition: "transform 0.6s ease" }}
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <PlaceholderImage category={product.category} />
          )}

          {/* Featured badge */}
          {product.featured && (
            <span
              style={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                background: "#c9a84c",
                color: "#0a0a0a",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                padding: "0.3rem 0.75rem",
                textTransform: "uppercase",
              }}
            >
              FEATURED
            </span>
          )}

          {/* Category badge */}
          <span
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "rgba(0,0,0,0.7)",
              color: categoryColor,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.6rem",
              fontWeight: 500,
              letterSpacing: "0.15em",
              padding: "0.3rem 0.75rem",
              textTransform: "uppercase",
              border: `1px solid ${categoryColor}`,
            }}
          >
            {categoryLabel}
          </span>

          {/* Overlay on hover */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.3)",
              opacity: 0,
              transition: "opacity 0.4s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="card-overlay"
          >
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#c9a84c",
                textTransform: "uppercase",
                border: "1px solid #c9a84c",
                padding: "0.6rem 1.5rem",
              }}
            >
              VIEW DETAILS
            </span>
          </div>
        </div>

        {/* Product info */}
        <div style={{ padding: "1.25rem 1rem 1.5rem" }}>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.2rem",
              fontWeight: 400,
              letterSpacing: "0.05em",
              color: "#f5f5f0",
              margin: "0 0 0.4rem",
              lineHeight: 1.2,
            }}
          >
            {product.name}
          </h3>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.75rem",
              color: "#c9a84c",
              fontWeight: 400,
              letterSpacing: "0.05em",
              margin: 0,
            }}
          >
            € {product.price.toLocaleString("en-EU")}
          </p>
        </div>
      </article>

      <style>{`
        article.product-card:hover .card-overlay {
          opacity: 1 !important;
        }
        article.product-card:hover img {
          transform: scale(1.06) !important;
        }
      `}</style>
    </Link>
  );
}

function PlaceholderImage({ category }: { category: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #1a1a1a 0%, #222222 50%, #1a1a1a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
      }}
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {category === "wedding" ? (
          // Wedding dress silhouette
          <path
            d="M24 4 C24 4 18 8 18 14 C18 18 20 20 20 24 L14 40 L34 40 L28 24 C28 20 30 18 30 14 C30 8 24 4 24 4Z"
            stroke="#c9a84c"
            strokeWidth="1"
            fill="none"
            opacity="0.6"
          />
        ) : (
          // Dress silhouette
          <path
            d="M24 6 C21 6 18 8 18 12 L14 24 L10 40 L38 40 L34 24 L30 12 C30 8 27 6 24 6Z M18 12 L14 24 M30 12 L34 24"
            stroke="#c9a84c"
            strokeWidth="1"
            fill="none"
            opacity="0.6"
          />
        )}
      </svg>
      <p
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          color: "#444440",
          textTransform: "uppercase",
        }}
      >
        {category === "wedding" ? "Bridal" : "Fashion"}
      </p>
    </div>
  );
}
