import { BarChart3, Boxes, BookText, KanbanSquare, LayoutDashboard, Settings2, Users2 } from 'lucide-react';

export const workspaceSections = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/products', icon: Boxes },
  { label: 'Roadmap', href: '/roadmap', icon: BarChart3 },
  { label: 'Tasks', href: '/tasks', icon: KanbanSquare },
  { label: 'Docs', href: '/docs', icon: BookText },
  { label: 'Team', href: '/team', icon: Users2 },
  { label: 'Settings', href: '/settings', icon: Settings2 },
] as const;

export const productStatuses = ['idea', 'validating', 'building', 'launched', 'paused'] as const;
export const roadmapStatuses = ['planned', 'in-progress', 'shipped'] as const;
export const taskStatuses = ['todo', 'in-progress', 'review', 'done'] as const;