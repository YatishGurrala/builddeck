"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Twitter,
  Linkedin,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Send,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { publishPost, editSocialPost } from "@/actions/social";
import { formatDate } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logoUrl: string | null;
  websiteUrl: string | null;
}

interface SocialPost {
  id: string;
  platform: string;
  content: string;
  status: string;
  productId: string;
  publishedAt: Date | null;
  publishedId?: string | null;
  errorMessage?: string | null;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
}

interface SocialPostCardProps {
  post: SocialPost;
}

const platformConfig = {
  X: {
    icon: Twitter,
    name: "X (Twitter)",
    color: "text-zinc-300",
    bgColor: "bg-zinc-800",
    maxChars: 280,
  },
  LINKEDIN: {
    icon: Linkedin,
    name: "LinkedIn",
    color: "text-blue-400",
    bgColor: "bg-blue-950/50",
    maxChars: 3000,
  },
};

const statusConfig = {
  DRAFT: {
    icon: Clock,
    label: "Draft",
    variant: "secondary" as const,
    color: "text-yellow-400",
  },
  SCHEDULED: {
    icon: Clock,
    label: "Scheduled",
    variant: "secondary" as const,
    color: "text-blue-400",
  },
  PUBLISHED: {
    icon: CheckCircle,
    label: "Published",
    variant: "default" as const,
    color: "text-green-400",
  },
  FAILED: {
    icon: XCircle,
    label: "Failed",
    variant: "destructive" as const,
    color: "text-red-400",
  },
};

export function SocialPostCard({ post }: SocialPostCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const platform = platformConfig[post.platform as keyof typeof platformConfig] || platformConfig.X;
  const status = statusConfig[post.status as keyof typeof statusConfig] || statusConfig.DRAFT;
  const PlatformIcon = platform.icon;
  const StatusIcon = status.icon;

  const handlePublish = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await publishPost(post.id);
      if (result.success) {
        setMessage({ type: "success", text: `Successfully published to ${platform.name}!` });
      } else {
        setMessage({ type: "error", text: result.error || "Failed to publish" });
      }
    });
  };

  const handleSaveEdit = () => {
    if (editedContent.trim() === post.content) {
      setIsEditOpen(false);
      return;
    }

    startTransition(async () => {
      const result = await editSocialPost(post.id, editedContent.trim());
      if (result.success) {
        setIsEditOpen(false);
        setMessage({ type: "success", text: "Content updated successfully!" });
      } else {
        setMessage({ type: "error", text: result.error || "Failed to update" });
      }
    });
  };

  const charCount = editedContent.length;
  const isOverLimit = charCount > platform.maxChars;

  return (
    <Card className={`${platform.bgColor} border-zinc-800`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Product Info */}
          <div className="flex-shrink-0">
            {post.product.logoUrl ? (
              <Image
                src={post.product.logoUrl}
                alt={post.product.name}
                width={48}
                height={48}
                className="rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-zinc-400">
                  {post.product.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/products/${post.product.slug}`}
                className="font-medium text-white hover:text-violet-400"
              >
                {post.product.name}
              </Link>
              <Badge variant="outline" className={`gap-1 ${platform.color}`}>
                <PlatformIcon className="h-3 w-3" />
                {platform.name}
              </Badge>
              <Badge variant={status.variant} className="gap-1">
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
            </div>

            {/* Post Content */}
            <div className="bg-zinc-900/50 rounded-lg p-4 mb-4">
              <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-sans">
                {post.content}
              </pre>
              <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                <span>{post.content.length} / {platform.maxChars} characters</span>
                <span>Created {formatDate(post.createdAt)}</span>
              </div>
            </div>

            {/* Error Message */}
            {post.status === "FAILED" && post.errorMessage && (
              <div className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-950/30 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{post.errorMessage}</span>
              </div>
            )}

            {/* Published Info */}
            {post.status === "PUBLISHED" && post.publishedAt && (
              <div className="flex items-center gap-2 text-green-400 text-sm mb-4">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <span>Published {formatDate(post.publishedAt)}</span>
                {post.publishedId && (
                  <a
                    href={post.publishedId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-violet-400 hover:text-violet-300"
                  >
                    View post <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}

            {/* Success/Error Messages */}
            {message && (
              <div
                className={`flex items-center gap-2 text-sm mb-4 p-3 rounded-lg ${
                  message.type === "success"
                    ? "text-green-400 bg-green-950/30"
                    : "text-red-400 bg-red-950/30"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {message.text}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Edit Button */}
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={post.status === "PUBLISHED" || isPending}
                    onClick={() => setEditedContent(post.content)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <PlatformIcon className={`h-5 w-5 ${platform.color}`} />
                      Edit {platform.name} Post
                    </DialogTitle>
                    <DialogDescription>
                      Edit the post content for {post.product.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className={`min-h-[200px] ${isOverLimit ? "border-red-500" : ""}`}
                      placeholder="Enter post content..."
                    />
                    <div className={`mt-2 text-sm ${isOverLimit ? "text-red-400" : "text-zinc-400"}`}>
                      {charCount} / {platform.maxChars} characters
                      {isOverLimit && " (over limit!)"}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditOpen(false)}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      disabled={isPending || isOverLimit || !editedContent.trim()}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Publish Button */}
              {(post.status === "DRAFT" || post.status === "FAILED") && (
                <Button
                  size="sm"
                  onClick={handlePublish}
                  disabled={isPending}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-1" />
                      Publish to {platform.name}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
