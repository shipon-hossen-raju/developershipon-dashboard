import {
  BookOpen,
  Briefcase,
  Bug,
  CalendarDays,
  FolderKanban,
  MessageSquare,
  Star,
  UserCheck,
  Wrench,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageLoader, Skeleton } from "../components/ui";
import { useAppSelector } from "../hooks/redux";
import {
  useGetHireRequestsQuery,
  useGetMessagesQuery,
  useGetProjectsQuery,
} from "../store/api/endpoints";
import { useGetDashboardStatsQuery } from "@/store/api/dashboard.api";

const PIE_COLORS = [
  "#198f51",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export default function DashboardHome() {
  const user = useAppSelector((s) => s.auth.user);
  const { data: statsData, isLoading: statsLoading } =
    useGetDashboardStatsQuery();
  const { data: projectsData } = useGetProjectsQuery();
  const { data: messagesData } = useGetMessagesQuery();
  const { data: hireData } = useGetHireRequestsQuery();

  const stats = statsData?.data;
  const projects = projectsData?.data ?? [];
  const messages = messagesData?.data ?? [];
  const hireRequests = hireData?.data ?? [];

  // Project type distribution for pie chart
  const projectTypes = projects.reduce((acc: Record<string, number>, p) => {
    acc[p.type] = (acc[p.type] ?? 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(projectTypes).map(([name, value]) => ({
    name,
    value,
  }));

  // Recent messages (last 5)
  const recentMessages = [...messages]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  // Hire requests by status
  const hireByStatus = ["pending", "reviewed", "accepted", "rejected"].map(
    (s) => ({
      status: s.charAt(0).toUpperCase() + s.slice(1),
      count: hireRequests.filter((h) => h.status === s).length,
    }),
  );

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (statsLoading) return <PageLoader />;

  const statCards = [
    {
      label: "Projects",
      value: stats?.projects ?? projects.length,
      icon: <FolderKanban size={20} />,
      color: "bg-primary/10 text-primary",
      to: "/projects",
    },
    {
      label: "Experiences",
      value: stats?.experiences ?? 0,
      icon: <Briefcase size={20} />,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      to: "/experiences",
    },
    {
      label: "Services",
      value: stats?.services ?? 0,
      icon: <Wrench size={20} />,
      color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      to: "/services",
    },
    {
      label: "Blog Posts",
      value: stats?.blogs ?? 0,
      icon: <BookOpen size={20} />,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      to: "/blogs",
    },
    {
      label: "Events",
      value: stats?.events ?? 0,
      icon: <CalendarDays size={20} />,
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      to: "/events",
    },
    {
      label: "Problems Solved",
      value: stats?.problems ?? 0,
      icon: <Bug size={20} />,
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      to: "/problems",
    },
    {
      label: "Skills",
      value: stats?.skills ?? 0,
      icon: <Zap size={20} />,
      color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      to: "/skills",
    },
    {
      label: "Unread Messages",
      value: stats?.unreadMessages ?? messages.filter((m) => !m.read).length,
      icon: <MessageSquare size={20} />,
      color: "bg-red-500/10 text-red-600 dark:text-red-400",
      to: "/messages",
    },
    {
      label: "Hire Requests",
      value:
        stats?.pendingHireRequests ??
        hireRequests.filter((h) => h.status === "pending").length,
      icon: <UserCheck size={20} />,
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
      to: "/hire-requests",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="dash-card bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted dark:text-text-muted-dark">
              {greeting} 👋
            </p>
            <h2 className="text-xl font-bold text-text-main dark:text-text-main-dark mt-0.5">
              Welcome back, {user?.name?.split(" ")[0] ?? "Shipon"}
            </h2>
            <p className="text-sm text-text-muted dark:text-text-muted-dark mt-1">
              Here's what's happening with your portfolio today.
            </p>
          </div>
          <div className="hidden md:block text-5xl">🚀</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} to={card.to}>
            <div className="dash-card hover:shadow-card-hover transition-shadow cursor-pointer group">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}
              >
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-text-main dark:text-text-main-dark group-hover:text-primary transition-colors">
                {statsLoading ? <Skeleton className="h-7 w-12" /> : card.value}
              </p>
              <p className="text-xs text-text-muted dark:text-text-muted-dark mt-0.5">
                {card.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Hire requests bar chart */}
        <div className="dash-card">
          <h3 className="text-sm font-bold text-text-main dark:text-text-main-dark mb-4">
            Hire Requests by Status
          </h3>
          {hireRequests.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-text-muted dark:text-text-muted-dark text-sm">
              No hire requests yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={hireByStatus} barSize={32}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="status"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: 12,
                    fontSize: 13,
                  }}
                  labelStyle={{ color: "#f1f5f9" }}
                  itemStyle={{ color: "#94a3b8" }}
                />
                <Bar dataKey="count" fill="#198f51" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Project type pie */}
        <div className="dash-card">
          <h3 className="text-sm font-bold text-text-main dark:text-text-main-dark mb-4">
            Projects by Type
          </h3>
          {pieData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-text-muted dark:text-text-muted-dark text-sm">
              No projects yet
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: 12,
                      fontSize: 13,
                    }}
                    labelStyle={{ color: "#f1f5f9" }}
                    itemStyle={{ color: "#94a3b8" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {pieData.map((entry, i) => (
                  <div
                    key={entry.name}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    <span className="text-text-muted dark:text-text-muted-dark capitalize">
                      {entry.name}
                    </span>
                    <span className="font-bold text-text-main dark:text-text-main-dark ml-auto">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent messages + Featured projects */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="dash-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text-main dark:text-text-main-dark">
              Recent Messages
            </h3>
            <Link
              to="/messages"
              className="text-xs text-primary hover:underline font-medium"
            >
              View all →
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-sm text-text-muted dark:text-text-muted-dark text-center py-6">
              No messages yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-bg-main dark:bg-slate-800/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {msg.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-text-main dark:text-text-main-dark truncate">
                        {msg.name}
                      </p>
                      {!msg.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark truncate">
                      {msg.subject}
                    </p>
                  </div>
                  <p className="text-xs text-text-muted dark:text-text-muted-dark shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured Projects */}
        <div className="dash-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text-main dark:text-text-main-dark">
              Featured Projects
            </h3>
            <Link
              to="/projects"
              className="text-xs text-primary hover:underline font-medium"
            >
              Manage →
            </Link>
          </div>
          {projects.filter((p) => p.featured).length === 0 ? (
            <p className="text-sm text-text-muted dark:text-text-muted-dark text-center py-6">
              No featured projects
            </p>
          ) : (
            <div className="space-y-3">
              {projects
                .filter((p) => p.featured)
                .slice(0, 4)
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-bg-main dark:bg-slate-800/50"
                  >
                    <Star size={14} className="text-amber-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-main dark:text-text-main-dark truncate">
                        {p.title}
                      </p>
                      <p className="text-xs text-text-muted dark:text-text-muted-dark capitalize">
                        {p.type} · {p.status}
                      </p>
                    </div>
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline shrink-0"
                      >
                        Live ↗
                      </a>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
