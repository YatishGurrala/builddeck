"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createProduct, updateProduct } from "@/actions/products";
import type { Product, Category } from "@/types";

interface ProductFormProps {
  categories: Category[];
  product?: Product;
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    product?.logoUrl || null
  );
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>(
    product?.screenshots ? JSON.parse(product.screenshots) : []
  );

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = product
      ? await updateProduct(product.id, formData)
      : await createProduct(formData);

    if (!result.success) {
      setError(result.error || "Something went wrong");
      setIsLoading(false);
    } else if (product) {
      router.push("/dashboard");
    }
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  }

  function handleScreenshotsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const newPreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setScreenshotPreviews((prev) => [...prev, ...newPreviews]);
    }
  }

  function removeScreenshot(index: number) {
    setScreenshotPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="My Awesome Product"
          defaultValue={product?.name}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline *</Label>
        <Input
          id="tagline"
          name="tagline"
          placeholder="A short, catchy description (10-200 characters)"
          defaultValue={product?.tagline}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Tell us more about your product (50-2000 characters)"
          defaultValue={product?.description || ""}
          rows={6}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website_url">Website URL *</Label>
        <Input
          id="website_url"
          name="website_url"
          type="url"
          placeholder="https://yourproduct.com"
          defaultValue={product?.websiteUrl}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category_id">Category *</Label>
        <Select
          id="category_id"
          name="category_id"
          defaultValue={product?.categoryId || ""}
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">Logo</Label>
        <div className="flex items-center gap-4">
          {logoPreview && (
            <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-zinc-800">
              <img
                src={logoPreview}
                alt="Logo preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-zinc-700 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800 transition-colors">
            <Upload className="h-4 w-4" />
            <span>{logoPreview ? "Change logo" : "Upload logo"}</span>
            <input
              id="logo"
              name="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="screenshots">Screenshots</Label>
        <div className="space-y-4">
          {screenshotPreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {screenshotPreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800 group"
                >
                  <img
                    src={preview}
                    alt={`Screenshot ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeScreenshot(index)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-zinc-900/80 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-700 bg-zinc-800/50 px-4 py-8 text-sm text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800 transition-colors">
            <Upload className="h-4 w-4" />
            <span>Add screenshots</span>
            <input
              id="screenshots"
              name="screenshots"
              type="file"
              accept="image/*"
              multiple
              onChange={handleScreenshotsChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" isLoading={isLoading}>
          {product ? "Update Product" : "Submit Product"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
