"use client";

import { useState, useTransition } from "react";
import { Plus, FileText, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createWorkspaceDocAction,
  updateWorkspaceDocAction,
  deleteWorkspaceDocAction,
} from "@/actions/workspace/docs";
import { formatDate } from "@/lib/utils";

interface Doc {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

interface DocEditorProps {
  productId: string;
  docs: Doc[];
}

export function DocEditor({ productId, docs }: DocEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(docs[0] ?? null);
  const [editContent, setEditContent] = useState(docs[0]?.content ?? "");
  const [editTitle, setEditTitle] = useState(docs[0]?.title ?? "");
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  function selectDoc(doc: Doc) {
    setSelectedDoc(doc);
    setEditContent(doc.content);
    setEditTitle(doc.title);
    setIsDirty(false);
  }

  function handleSave() {
    if (!selectedDoc) return;
    const formData = new FormData();
    formData.set("title", editTitle);
    formData.set("content", editContent);
    startTransition(async () => {
      await updateWorkspaceDocAction(selectedDoc.id, productId, formData);
      setIsDirty(false);
    });
  }

  function handleCreate() {
    if (!newTitle.trim()) return;
    const formData = new FormData();
    formData.set("title", newTitle.trim());
    formData.set("content", "");
    startTransition(async () => {
      await createWorkspaceDocAction(productId, formData);
      setNewTitle("");
      setIsCreating(false);
    });
  }

  function handleDelete(docId: string) {
    startTransition(async () => {
      await deleteWorkspaceDocAction(docId, productId);
      if (selectedDoc?.id === docId) {
        setSelectedDoc(null);
        setEditContent("");
        setEditTitle("");
      }
    });
  }

  return (
    <div className="flex gap-4 h-[500px]">
      {/* Doc list sidebar */}
      <div className="w-52 shrink-0 border-r border-[var(--surface-container-high)] pr-4 flex flex-col gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsCreating(true)}
          className="w-full justify-start gap-2"
        >
          <Plus className="h-3.5 w-3.5" />
          New Doc
        </Button>

        {isCreating && (
          <div className="space-y-1.5">
            <Input
              autoFocus
              placeholder="Doc title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setIsCreating(false); }}
              className="h-7 text-xs"
            />
            <div className="flex gap-1">
              <Button size="sm" className="h-6 text-xs px-2" onClick={handleCreate} disabled={!newTitle.trim()}>Create</Button>
              <Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-0.5 overflow-y-auto flex-1">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className={`group flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer transition-colors ${
                selectedDoc?.id === doc.id
                  ? "bg-[var(--primary)] text-white"
                  : "hover:bg-[var(--surface-container)] text-[var(--on-surface)]"
              }`}
              onClick={() => selectDoc(doc)}
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs truncate flex-1">{doc.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                disabled={isPending}
                className={`opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400 ${selectedDoc?.id === doc.id ? "text-white/70" : "text-[var(--on-surface-variant)]"}`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
          {docs.length === 0 && !isCreating && (
            <p className="text-xs text-[var(--on-surface-variant)] px-2 py-4 text-center">
              No docs yet
            </p>
          )}
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedDoc ? (
          <>
            <div className="flex items-center justify-between gap-3 mb-3">
              <Input
                value={editTitle}
                onChange={(e) => { setEditTitle(e.target.value); setIsDirty(true); }}
                className="font-semibold text-base border-none shadow-none px-0 focus-visible:ring-0"
              />
              <div className="flex items-center gap-2 shrink-0">
                {isDirty && (
                  <span className="text-xs text-[var(--on-surface-variant)]">Unsaved</span>
                )}
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isPending || !isDirty}
                  className="gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
            <p className="text-xs text-[var(--on-surface-variant)] mb-2">
              Last updated {formatDate(selectedDoc.updatedAt)}
            </p>
            <Textarea
              value={editContent}
              onChange={(e) => { setEditContent(e.target.value); setIsDirty(true); }}
              placeholder="Start writing your notes here..."
              className="flex-1 resize-none font-mono text-sm leading-relaxed"
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-[var(--on-surface-variant)]">
              Select a doc or create a new one
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
