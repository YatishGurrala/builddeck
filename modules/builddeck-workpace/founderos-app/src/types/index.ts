export type WorkspaceRole = 'owner' | 'admin' | 'member';
export type ProductStatus = 'idea' | 'validating' | 'building' | 'launched' | 'paused';
export type RoadmapStatus = 'planned' | 'in-progress' | 'shipped';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high';
export type DocTemplate = 'prd' | 'launch_plan' | 'feature_spec';

export type WorkspaceSummary = {
  id: string;
  name: string;
  slug: string;
  role: WorkspaceRole;
};