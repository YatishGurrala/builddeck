import { create } from 'zustand';
import type { WorkspaceSummary } from '@/types';

type WorkspaceState = {
  workspaces: WorkspaceSummary[];
  activeWorkspaceId: string | null;
  setWorkspaces: (workspaces: WorkspaceSummary[]) => void;
  setActiveWorkspaceId: (workspaceId: string) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaces: [],
  activeWorkspaceId: null,
  setWorkspaces: (workspaces) =>
    set((state) => ({
      workspaces,
      activeWorkspaceId: state.activeWorkspaceId ?? workspaces[0]?.id ?? null,
    })),
  setActiveWorkspaceId: (workspaceId) => set({ activeWorkspaceId: workspaceId }),
}));