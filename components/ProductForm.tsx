"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product, ProductCategory } from "@/lib/types";

interface ProductFormProps {
  product?: Product;
  mode: "create" | "edit";
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [category, setCategory] = useState<ProductCategory>(product?.category || "fashion");
  const [featured, setFeatured] = useState(product?.featured || false);
  const [images, setImages] = useState<string[]>(product?.images || []);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (files: FileList) => {
    setUploadError("");
    setUploading(true);

    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok) {
          uploaded.push(data.url);
        } else {
          setUploadError(data.error || "Upload failed");
        }
      } catch {
        setUploadError("Upload failed. Please try again.");
      }
    }

    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    const updated = [...images];
    const [item] = updated.splice(from, 1);
    updated.splice(to, 0, item);
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");

    if (!name.trim() || !description.trim() || !price || !category) {
      setSaveError("Please fill in all required fields.");
      return;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      setSaveError("Please enter a valid price.");
      return;
    }

    setSaving(true);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      featured,
      images,
    };

    try {
      const url = mode === "create" ? "/api/products" : `/api/products/${product!.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const data = await res.json();
        setSaveError(data.error || "Failed to save product");
      }
    } catch {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "#111111",
    border: "1px solid rgba(201,168,76,0.2)",
    color: "#f5f5f0",
    padding: "0.875rem 1rem",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.85rem",
    outline: "none",
    transition: "border-color 0.3s ease",
  };

  const labelStyle = {
    display: "block" as const,
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.65rem",
    letterSpacing: "0.15em",
    color: "#888880",
    textTransform: "uppercase" as const,
    marginBottom: "0.5rem",
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
        }}
        className="product-form-grid"
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>
              Product Name <span style={{ color: "#c9a84c" }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Velvet Evening Gown"
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.2)")}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>
              Description <span style={{ color: "#c9a84c" }}>*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the fabric, silhouette, detailing..."
              required
              rows={6}
              style={{
                ...inputStyle,
                resize: "vertical",
                lineHeight: 1.7,
              }}
              onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.2)")}
            />
          </div>

          {/* Price */}
          <div>
            <label style={labelStyle}>
              Price (€) <span style={{ color: "#c9a84c" }}>*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 1850"
              required
              min="1"
              step="0.01"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.2)")}
            />
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>
              Category <span style={{ color: "#c9a84c" }}>*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              style={{
                ...inputStyle,
                cursor: "pointer",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.2)")}
            >
              <option value="fashion">Women&apos;s Fashion</option>
              <option value="wedding">Bridal / Wedding Dress</option>
            </select>
          </div>

          {/* Featured */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              cursor: "pointer",
            }}
            onClick={() => setFeatured((v) => !v)}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                border: `1px solid ${featured ? "#c9a84c" : "rgba(255,255,255,0.2)"}`,
                background: featured ? "#c9a84c" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
            >
              {featured && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.75rem",
                color: "#888880",
                userSelect: "none",
              }}
            >
              Mark as Featured
            </span>
          </div>
        </div>

        {/* Right column – images */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={labelStyle}>Product Images</label>

            {/* Upload area */}
            <div
              style={{
                border: "1px dashed rgba(201,168,76,0.3)",
                padding: "2rem",
                textAlign: "center",
                cursor: "pointer",
                background: "#0d0d0d",
                transition: "border-color 0.3s ease",
                marginBottom: "1rem",
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (files.length > 0) handleImageUpload(files);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files?.length) {
                    handleImageUpload(e.target.files);
                    e.target.value = "";
                  }
                }}
              />
              {uploading ? (
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", color: "#c9a84c" }}>
                  Uploading...
                </p>
              ) : (
                <>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", color: "#888880", marginBottom: "0.25rem" }}>
                    Click or drag & drop images here
                  </p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.65rem", color: "#444440" }}>
                    JPEG, PNG, WebP · Max 10MB each
                  </p>
                </>
              )}
            </div>

            {uploadError && (
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", color: "#e05050", marginBottom: "0.75rem" }}>
                {uploadError}
              </p>
            )}

            {/* Uploaded images */}
            {images.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {images.map((url, i) => (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      width: "90px",
                      height: "110px",
                      border: i === 0 ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.1)",
                      overflow: "hidden",
                      background: "#1a1a1a",
                    }}
                  >
                    <Image
                      src={url}
                      alt={`Image ${i + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="90px"
                    />
                    {/* Controls overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.6)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.25rem",
                        opacity: 0,
                        transition: "opacity 0.2s ease",
                      }}
                      className="img-overlay"
                    >
                      {i > 0 && (
                        <button
                          type="button"
                          onClick={() => moveImage(i, i - 1)}
                          title="Move left"
                          style={{ background: "none", border: "1px solid #c9a84c", color: "#c9a84c", cursor: "pointer", fontSize: "0.6rem", padding: "0.15rem 0.4rem" }}
                        >
                          ←
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        title="Remove"
                        style={{ background: "none", border: "1px solid #e05050", color: "#e05050", cursor: "pointer", fontSize: "0.6rem", padding: "0.15rem 0.4rem" }}
                      >
                        ✕
                      </button>
                      {i < images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveImage(i, i + 1)}
                          title="Move right"
                          style={{ background: "none", border: "1px solid #c9a84c", color: "#c9a84c", cursor: "pointer", fontSize: "0.6rem", padding: "0.15rem 0.4rem" }}
                        >
                          →
                        </button>
                      )}
                    </div>
                    {i === 0 && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: "rgba(201,168,76,0.8)",
                          color: "#0a0a0a",
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.5rem",
                          textAlign: "center",
                          padding: "0.15rem",
                          letterSpacing: "0.1em",
                        }}
                      >
                        MAIN
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.6rem", color: "#444440", marginTop: "0.75rem" }}>
              First image is displayed as the main product photo. Hover over images to reorder or remove.
            </p>
          </div>
        </div>
      </div>

      {saveError && (
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.75rem",
            color: "#e05050",
            padding: "0.75rem 1rem",
            background: "rgba(224,80,80,0.08)",
            border: "1px solid rgba(224,80,80,0.2)",
            marginTop: "1.5rem",
          }}
        >
          {saveError}
        </p>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
        <button
          type="submit"
          disabled={saving}
          className="btn-gold-solid"
          style={{ opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}
        >
          {saving ? "SAVING..." : mode === "create" ? "CREATE PRODUCT" : "SAVE CHANGES"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="btn-gold"
        >
          CANCEL
        </button>
      </div>

      <style>{`
        .product-form-grid {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 768px) {
          .product-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .img-overlay:hover {
          opacity: 1 !important;
        }
        div:has(.img-overlay):hover .img-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </form>
  );
}
