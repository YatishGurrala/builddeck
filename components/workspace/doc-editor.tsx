"use client";

import { useState, useTransition } from "react";
import { Plus, FileText, Trash2, Save } from "lucide-react";
import {
  createWorkspaceDocAction,
  updateWorkspaceDocAction,
  deleteWorkspaceDocAction,
} from "@/actions/workspace/docs";
import { formatDate } from "@/lib/utils";

interface Doc {
  id: string;
  title: string;
  content?: string | null;
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
    setEditContent(doc.content ?? "");
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
      <div className="w-52 shrink-0 border-r border-[#27272a] pr-4 flex flex-col gap-2">
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 w-full px-3 py-1.5 bg-[#1c1b1d] border border-[#27272a] text-[#a1a1aa] rounded text-xs font-mono tracking-wider hover:text-[#e5e1e4] hover:border-[#444748] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New Doc
        </button>

        {isCreating && (
          <div className="space-y-1.5">
            <input
              autoFocus
              placeholder="Doc title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setIsCreating(false); }}
              className="w-full bg-[#1c1b1d] border border-[#27272a] text-[#e5e1e4] rounded px-2 py-1 text-xs focus:border-[#6366f1] focus:outline-none"
            />
            <div className="flex gap-1">
              <button onClick={handleCreate} disabled={!newTitle.trim()} className="bg-white text-[#131315] px-2 py-0.5 rounded text-xs font-mono hover:bg-[#e2e2e2] disabled:opacity-50 transition-colors">Create</button>
              <button onClick={() => setIsCreating(false)} className="bg-[#1c1b1d] border border-[#27272a] text-[#a1a1aa] px-2 py-0.5 rounded text-xs font-mono hover:text-[#e5e1e4] transition-colors">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-0.5 overflow-y-auto flex-1">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className={`group flex items-center gap-2 rounded px-2 py-1.5 cursor-pointer transition-colors ${
                selectedDoc?.id === doc.id
                  ? "bg-[#2a2a2c] text-white"
                  : "hover:bg-[#1c1b1d] text-[#a1a1aa]"
              }`}
              onClick={() => selectDoc(doc)}
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs truncate flex-1">{doc.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                disabled={isPending}
                className={`opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400 ${selectedDoc?.id === doc.id ? "text-[#a1a1aa]" : "text-[#444748]"}`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
          {docs.length === 0 && !isCreating && (
            <p className="text-xs text-[#a1a1aa] px-2 py-4 text-center ws-label">
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
              <input
                value={editTitle}
                onChange={(e) => { setEditTitle(e.target.value); setIsDirty(true); }}
                className="flex-1 bg-transparent border-none text-[#e5e1e4] font-semibold text-base focus:outline-none"
              />
              <div className="flex items-center gap-2 shrink-0">
                {isDirty && (
                  <span className="text-xs text-[#a1a1aa] ws-label">Unsaved</span>
                )}
                <button
                  onClick={handleSave}
                  disabled={isPending || !isDirty}
                  className="flex items-center gap-1.5 bg-white text-[#131315] px-3 py-1 rounded text-xs font-mono tracking-wider hover:bg-[#e2e2e2] disabled:opacity-50 transition-colors"
                >
                  <Save className="h-3.5 w-3.5" />
                  {isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
            <p className="text-xs text-[#a1a1aa] ws-label mb-2">
              Last updated {formatDate(selectedDoc.updatedAt)}
            </p>
            <textarea
              value={editContent}
              onChange={(e) => { setEditContent(e.target.value); setIsDirty(true); }}
              placeholder="Start writing your notes here..."
              className="flex-1 resize-none bg-[#1c1b1d] border border-[#27272a] text-[#e5e1e4] rounded px-3 py-2 text-sm font-mono leading-relaxed focus:border-[#6366f1] focus:outline-none placeholder-[#444748]"
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-[#a1a1aa] ws-label">
              Select a doc or create a new one
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
