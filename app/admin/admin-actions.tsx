"use client";

import { useState } from "react";
import { Check, X, Star, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateProductStatus, toggleFeatured } from "@/actions/products";
import type { Product } from "@/types";

interface AdminActionsProps {
  product: Product;
}

export function AdminActions({ product }: AdminActionsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  async function handleApprove() {
    setIsLoading("approve");
    await updateProductStatus(product.id, "approved");
    setIsLoading(null);
    setShowMenu(false);
  }

  async function handleReject() {
    setIsLoading("reject");
    await updateProductStatus(product.id, "rejected");
    setIsLoading(null);
    setShowMenu(false);
  }

  async function handleToggleFeatured() {
    setIsLoading("feature");
    await toggleFeatured(product.id);
    setIsLoading(null);
    setShowMenu(false);
  }

  return (
    <div className="flex items-center gap-1">
      {/* Quick actions for pending */}
      {product.status === "pending" && (
        <>
          <button
            onClick={handleApprove}
            disabled={isLoading === "approve"}
            className="p-2 rounded-lg text-green-400 hover:bg-green-400/10 transition-colors disabled:opacity-50"
            title="Approve"
          >
            {isLoading === "approve" ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={handleReject}
            disabled={isLoading === "reject"}
            className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
            title="Reject"
          >
            {isLoading === "reject" ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        </>
      )}

      {/* Feature toggle for approved */}
      {product.status === "approved" && (
        <button
          onClick={handleToggleFeatured}
          disabled={isLoading === "feature"}
          className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
            product.featured
              ? "text-yellow-400 hover:bg-yellow-400/10"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-yellow-400"
          }`}
          title={product.featured ? "Remove from featured" : "Mark as featured"}
        >
          {isLoading === "feature" ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent" />
          ) : (
            <Star className={`h-4 w-4 ${product.featured ? "fill-yellow-400" : ""}`} />
          )}
        </button>
      )}

      {/* Re-approve for rejected */}
      {product.status === "rejected" && (
        <button
          onClick={handleApprove}
          disabled={isLoading === "approve"}
          className="p-2 rounded-lg text-zinc-400 hover:text-green-400 hover:bg-green-400/10 transition-colors disabled:opacity-50"
          title="Approve"
        >
          {isLoading === "approve" ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
}
