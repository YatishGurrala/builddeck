"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createWorkspaceProductAction,
  updateWorkspaceProductAction,
} from "@/actions/workspace/products";

const PRODUCT_STATUSES = ["IDEA", "BUILDING", "LAUNCHED", "PAUSED", "ARCHIVED"];
const ROADMAP_PHASES = ["DISCOVERY", "VALIDATION", "BUILDING", "BETA", "LAUNCHED"];

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: string;
  defaultValues?: {
    name?: string;
    tagline?: string;
    description?: string;
    websiteUrl?: string;
    status?: string;
    roadmapPhase?: string;
  };
}

export function ProductForm({ mode, productId, defaultValues }: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      if (mode === "create") {
        await createWorkspaceProductAction(formData);
      } else if (productId) {
        await updateWorkspaceProductAction(productId, formData);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="space-y-1.5">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g. FounderOS"
          defaultValue={defaultValues?.name}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tagline">Tagline</Label>
        <Input
          id="tagline"
          name="tagline"
          placeholder="One sentence that describes your product"
          defaultValue={defaultValues?.tagline}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="What are you building and why?"
          rows={4}
          defaultValue={defaultValues?.description}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="websiteUrl">Website URL</Label>
        <Input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          placeholder="https://yourproduct.com"
          defaultValue={defaultValues?.websiteUrl}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={defaultValues?.status ?? "IDEA"}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {PRODUCT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="roadmapPhase">Roadmap Phase</Label>
          <select
            id="roadmapPhase"
            name="roadmapPhase"
            defaultValue={defaultValues?.roadmapPhase ?? "DISCOVERY"}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {ROADMAP_PHASES.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0) + p.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? mode === "create" ? "Creating..." : "Saving..."
            : mode === "create" ? "Create Product" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
