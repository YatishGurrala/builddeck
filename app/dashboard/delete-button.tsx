"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/actions/products";

interface DeleteProductButtonProps {
  productId: string;
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    await deleteProduct(productId);
    setIsDeleting(false);
    setShowConfirm(false);
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          isLoading={isDeleting}
        >
          Delete
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowConfirm(false)}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setShowConfirm(true)}
      className="text-zinc-400 hover:text-red-400"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
