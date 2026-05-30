"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
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

  const labelClass = "block text-[#a1a1aa] text-xs font-mono tracking-wider uppercase mb-1";
  const inputClass = "w-full bg-[#1c1b1d] border border-[#27272a] text-[#e5e1e4] rounded px-3 py-2 text-sm focus:border-[#6366f1] focus:outline-none placeholder-[#444748]";
  const selectClass = "w-full bg-[#1c1b1d] border border-[#27272a] text-[#e5e1e4] rounded px-3 py-2 text-sm focus:border-[#6366f1] focus:outline-none";

  return (
    <form action={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Product Name *</label>
        <input
          name="name"
          placeholder="e.g. FounderOS"
          defaultValue={defaultValues?.name}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Tagline</label>
        <input
          name="tagline"
          placeholder="One sentence that describes your product"
          defaultValue={defaultValues?.tagline}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          placeholder="What are you building and why?"
          rows={4}
          defaultValue={defaultValues?.description}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className={labelClass}>Website URL</label>
        <input
          name="websiteUrl"
          type="url"
          placeholder="https://yourproduct.com"
          defaultValue={defaultValues?.websiteUrl}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Status</label>
          <select name="status" defaultValue={defaultValues?.status ?? "IDEA"} className={selectClass}>
            {PRODUCT_STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Roadmap Phase</label>
          <select name="roadmapPhase" defaultValue={defaultValues?.roadmapPhase ?? "DISCOVERY"} className={selectClass}>
            {ROADMAP_PHASES.map((p) => (
              <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-white text-[#131315] px-6 py-2 rounded hover:bg-[#e2e2e2] font-mono text-sm tracking-wider disabled:opacity-50 transition-colors"
        >
          {isPending
            ? mode === "create" ? "Creating..." : "Saving..."
            : mode === "create" ? "Create Product" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="bg-[#1c1b1d] border border-[#27272a] text-[#a1a1aa] px-6 py-2 rounded hover:text-[#e5e1e4] hover:border-[#444748] font-mono text-sm tracking-wider disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
