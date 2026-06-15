"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

interface ProfileAvatarFieldProps {
  initialAvatarUrl?: string;
  displayName: string;
}

export function ProfileAvatarField({ initialAvatarUrl = "", displayName }: ProfileAvatarFieldProps) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [rawUploadUrl, setRawUploadUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.35);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef<{ startX: number; startY: number; startPanX: number; startPanY: number } | null>(null);
  const renderVersionRef = useRef(0);

  const initials = useMemo(() => {
    const parts = displayName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "");
    return parts.join("") || "NA";
  }, [displayName]);

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

  useEffect(() => {
    if (!rawUploadUrl) return;

    const renderVersion = ++renderVersionRef.current;
    const image = new Image();
    image.onload = () => {
      if (renderVersion !== renderVersionRef.current) return;

      const size = 512;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const context = canvas.getContext("2d");
      if (!context) return;

      const baseScale = Math.max(size / image.width, size / image.height);
      const drawWidth = image.width * baseScale * zoom;
      const drawHeight = image.height * baseScale * zoom;

      const overflowX = Math.max(0, drawWidth - size);
      const overflowY = Math.max(0, drawHeight - size);

      let drawX = (size - drawWidth) / 2 + pan.x * (overflowX / 2);
      let drawY = (size - drawHeight) / 2 + pan.y * (overflowY / 2);

      if (overflowX > 0) drawX = clamp(drawX, -overflowX, 0);
      if (overflowY > 0) drawY = clamp(drawY, -overflowY, 0);

      context.clearRect(0, 0, size, size);
      context.drawImage(image, drawX, drawY, drawWidth, drawHeight);

      // Keep payload comfortably below Next.js server action body limit.
      const compressed = canvas.toDataURL("image/jpeg", 0.82);
      if (renderVersion === renderVersionRef.current) {
        setAvatarUrl(compressed);
      }
    };
    image.src = rawUploadUrl;

    return () => {
      if (renderVersion === renderVersionRef.current) {
        renderVersionRef.current += 1;
      }
    };
  }, [rawUploadUrl, zoom, pan]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Start slightly zoomed so horizontal drag is available for most portraits.
    setZoom(1.35);
    setPan({ x: 0, y: 0 });

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setRawUploadUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (value: string) => {
    setRawUploadUrl(null);
    setZoom(1.35);
    setPan({ x: 0, y: 0 });
    setAvatarUrl(value);
  };

  const previewSource = avatarUrl;

  return (
    <div className="space-y-4">
      <input type="hidden" name="avatarUrl" value={avatarUrl} />
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[color:var(--on-surface-variant)]">
            Photo URL
          </span>
          <Input
            value={avatarUrl}
            onChange={(event) => handleUrlChange(event.target.value)}
            placeholder="https://..."
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[color:var(--on-surface-variant)]">
            Upload Photo
          </span>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[140px_1fr] md:items-start">
        <div className="space-y-1.5">
          <span className="block text-xs font-semibold uppercase tracking-wide text-[color:var(--on-surface-variant)]">
            Photo Preview
          </span>
          <div
            className="relative aspect-square overflow-hidden rounded-2xl border border-[color:var(--outline-variant)] bg-[color:var(--surface-container-low)] shadow-sm touch-none"
            onPointerDown={(event) => {
              if (!rawUploadUrl) return;
              const target = event.currentTarget;
              target.setPointerCapture(event.pointerId);
              dragStateRef.current = {
                startX: event.clientX,
                startY: event.clientY,
                startPanX: pan.x,
                startPanY: pan.y,
              };
              setIsDragging(true);
            }}
            onPointerMove={(event) => {
              if (!rawUploadUrl || !dragStateRef.current) return;
              const rect = event.currentTarget.getBoundingClientRect();
              const deltaX = event.clientX - dragStateRef.current.startX;
              const deltaY = event.clientY - dragStateRef.current.startY;
              const nextPanX = clamp(dragStateRef.current.startPanX + deltaX / (rect.width / 2), -1, 1);
              const nextPanY = clamp(dragStateRef.current.startPanY + deltaY / (rect.height / 2), -1, 1);
              setPan({ x: nextPanX, y: nextPanY });
            }}
            onPointerUp={(event) => {
              event.currentTarget.releasePointerCapture(event.pointerId);
              dragStateRef.current = null;
              setIsDragging(false);
            }}
            onPointerCancel={(event) => {
              event.currentTarget.releasePointerCapture(event.pointerId);
              dragStateRef.current = null;
              setIsDragging(false);
            }}
          >
            {previewSource ? (
              <img
                src={previewSource}
                alt={displayName}
                className="h-full w-full object-cover select-none"
                draggable={false}
                style={{
                  objectPosition: `${50 + pan.x * 50}% ${50 + pan.y * 50}%`,
                  transform: `scale(${zoom})`,
                  transformOrigin: "center center",
                  cursor: rawUploadUrl ? (isDragging ? "grabbing" : "move") : "default",
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-[color:var(--on-surface-variant)]">
                {initials}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-[color:var(--on-surface-variant)]">
            Upload an image or paste a URL. If empty, initials are shown automatically.
          </p>
          {rawUploadUrl ? (
            <p className="text-xs text-[color:var(--on-surface-variant)]">
              Drag inside the preview to reposition. For stronger side-to-side movement, increase zoom.
            </p>
          ) : null}
          {rawUploadUrl ? (
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[color:var(--on-surface-variant)]">
                Zoom and Position
              </span>
              <Input
                type="range"
                min={1.15}
                max={2.4}
                step={0.05}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
              />
            </label>
          ) : null}
        </div>
      </div>
    </div>
  );
}
