"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

interface ProductImageFieldProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}

export function ProductImageField({
  name,
  defaultValue = "",
  placeholder = "Image URL (or upload a file)",
}: ProductImageFieldProps) {
  const isDataUrl = useMemo(() => defaultValue.startsWith("data:"), [defaultValue]);
  const [imageValue, setImageValue] = useState(defaultValue);
  const [urlInput, setUrlInput] = useState(isDataUrl ? "" : defaultValue);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;

      const image = new Image();
      image.onload = () => {
        const maxDimension = 1024;
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL("image/webp", 0.82);
        setImageValue(compressed);
        setUrlInput("");
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={imageValue} />
      <Input
        value={urlInput}
        onChange={(event) => {
          setUrlInput(event.target.value);
          setImageValue(event.target.value);
        }}
        placeholder={placeholder}
      />
      <Input type="file" accept="image/*" onChange={handleFileChange} />
      {imageValue.startsWith("data:") ? (
        <p className="text-xs text-[color:var(--on-surface-variant)]">Uploaded file selected</p>
      ) : null}
    </div>
  );
}
