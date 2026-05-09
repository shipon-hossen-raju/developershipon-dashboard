// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// ─── API Response ──────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── Project ───────────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  type: "full stack" | "backend" | "frontend";
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  duration: string;
  completedAt: string;
  status: "completed" | "in progress" | "maintained";
  technologies: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    other?: string[];
  };
  keyFeatures: string[];
  challenges?: string;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ProjectFormData = Omit<Project, "id" | "createdAt" | "updatedAt">;

// ─── Experience ────────────────────────────────────────────────────────────────
export interface Experience {
  id: string;
  companyName: string;
  link?: string;
  jobTitle: string;
  description: string;
  dateLine: {
    start: string;
    end: string; // "current" or ISO string
  };
  createdAt?: string;
}

export type ExperienceFormData = Omit<Experience, "id" | "createdAt">;

// ─── Service ───────────────────────────────────────────────────────────────────
export interface Service {
  id: string;
  title: string;
  description: string;
  rules: string[];
  icon?: string;
  createdAt?: string;
}

export type ServiceFormData = Omit<Service, "id" | "createdAt">;

// ─── Blog ──────────────────────────────────────────────────────────────────────
export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  featured: boolean;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type BlogFormData = Omit<Blog, "id" | "createdAt" | "updatedAt">;

// ─── Event ────────────────────────────────────────────────────────────────────
export interface PortfolioEvent {
  id: string;
  title: string;
  organizer: string;
  location: string;
  date: string;
  role: string;
  description: string;
  tags: string[];
  image?: string;
  certificate?: string;
  highlight: boolean;
  createdAt?: string;
}

export type EventFormData = Omit<PortfolioEvent, "id" | "createdAt">;

// ─── Problem ──────────────────────────────────────────────────────────────────
// export interface Problem {
//   id: string;
//   title: string;
//   platform: string;
//   difficulty: "easy" | "medium" | "hard";
//   tags: string[];
//   problem: string;
//   solution: string;
//   codeSnippet?: string;
//   solvedAt: string;
//   link?: string;
//   createdAt?: string;
//   isActive: boolean;
// }
export interface Problem {
  id: string;
  title: string;
  platform: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  problem: string;
  solution: string;
  codeSnippet: string;
  solvedAt: string;
  link: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export type ProblemFormData = Omit<Problem, "id" | "createdAt" | "order" | "updatedAt">;

// ─── Skill ────────────────────────────────────────────────────────────────────
export interface Skill {
  id: string;
  category: string;
  title: string;
  value: number; // 0-100
  createdAt?: string;
}

export type SkillFormData = Omit<Skill, "id" | "createdAt">;

// ─── Category ────────────────────────────────────────────────────────────────────
export interface Categories {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export type CategoryFormData = Omit<
  Categories,
  "id" | "createdAt" | "updatedAt" | "slug"
>;

// ─── Contact Message ──────────────────────────────────────────────────────────
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  contactNumber?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ─── Hire Request ─────────────────────────────────────────────────────────────
export interface HireRequest {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  service: string;
  message: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export interface DashboardStats {
  projects: number;
  experiences: number;
  services: number;
  blogs: number;
  events: number;
  skills: number;
  messages: number;
  unreadMessages: number;
  hireRequests: number;
  pendingHireRequests: number;
}

// ─── Table / UI ───────────────────────────────────────────────────────────────
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export type ToastType = "success" | "error" | "info" | "warning";

export interface ModalState {
  isOpen: boolean;
  mode: "create" | "edit" | "view" | "delete";
  data?: unknown;
}
