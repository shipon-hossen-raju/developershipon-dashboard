import { useState } from "react";
import {
  Save,
  Loader2,
  Globe,
  User,
  Palette,
  Bell,
  Shield,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { PageHeader } from "../components/ui";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { toggleTheme } from "../store/slices/uiSlice";

// Portfolio config — edit these to match your portfolio
const PORTFOLIO_URL = "https://developershipon.vercel.app";
const GITHUB_URL = "https://github.com/shipon-hossen-raju";
const LINKEDIN_URL = "https://www.linkedin.com/in/md-shipon-bapari";

const SECTIONS = [
  { id: "home", label: "Home Banner", path: "/", icon: "🏠" },
  { id: "projects", label: "Projects", path: "/projects", icon: "📁" },
  { id: "experiences", label: "Experience", path: "/experiences", icon: "💼" },
  { id: "services", label: "Services", path: "/services", icon: "🔧" },
  { id: "blogs", label: "Blog Posts", path: "/blogs", icon: "📝" },
  { id: "events", label: "Events", path: "/events", icon: "🗓" },
  { id: "problems", label: "Problems Solved", path: "/problems", icon: "🐛" },
  { id: "skills", label: "Skills", path: "/skills", icon: "⚡" },
];

type Tab = "portfolio" | "appearance" | "account" | "about";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const [activeTab, setActiveTab] = useState<Tab>("portfolio");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "portfolio", label: "Portfolio", icon: <Globe size={15} /> },
    { id: "appearance", label: "Appearance", icon: <Palette size={15} /> },
    { id: "account", label: "Account", icon: <User size={15} /> },
    { id: "about", label: "About", icon: <Shield size={15} /> },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Settings"
        desc="Manage your portfolio and dashboard preferences"
      />

      {/* Tab Bar */}
      <div className="flex gap-1 p-1 bg-bg-main dark:bg-slate-800/50 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-surface dark:bg-surface-dark text-text-main dark:text-text-main-dark shadow-sm"
                : "text-text-muted dark:text-text-muted-dark hover:text-text-main dark:hover:text-text-main-dark"
            }`}
          >
            {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Portfolio Tab ── */}
      {activeTab === "portfolio" && (
        <div className="space-y-4">
          <div className="dash-card">
            <h3 className="text-sm font-bold text-text-main dark:text-text-main-dark mb-1">
              Portfolio Sections
            </h3>
            <p className="text-xs text-text-muted dark:text-text-muted-dark mb-5">
              Manage all your portfolio content from the dashboard.
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {SECTIONS.map((s) => (
                <Link
                  key={s.id}
                  to={s.path}
                  className="flex items-center gap-3 p-3 rounded-xl border border-divider-primary dark:border-border-dark bg-bg-main dark:bg-slate-800/40 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                >
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-sm font-medium text-text-main dark:text-text-main-dark group-hover:text-primary transition-colors">
                    {s.label}
                  </span>
                  <ExternalLink
                    size={12}
                    className="ml-auto text-text-muted opacity-0 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </div>

          <div className="dash-card">
            <h3 className="text-sm font-bold text-text-main dark:text-text-main-dark mb-1">
              Portfolio Links
            </h3>
            <p className="text-xs text-text-muted dark:text-text-muted-dark mb-4">
              Quick links to your live portfolio pages.
            </p>
            <div className="space-y-2">
              {[
                { label: "Live Portfolio", url: PORTFOLIO_URL },
                { label: "GitHub Profile", url: GITHUB_URL },
                { label: "LinkedIn Profile", url: LINKEDIN_URL },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-bg-main dark:bg-slate-800/40 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group"
                >
                  <span className="text-sm font-medium text-text-main dark:text-text-main-dark">
                    {link.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted dark:text-text-muted-dark truncate max-w-[200px]">
                      {link.url}
                    </span>
                    <ExternalLink size={13} className="text-primary shrink-0" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="dash-card">
            <h3 className="text-sm font-bold text-text-main dark:text-text-main-dark mb-1">
              Quick Stats
            </h3>
            <p className="text-xs text-text-muted dark:text-text-muted-dark mb-4">
              Overview of your portfolio content.
            </p>
            <div className="grid grid-cols-4 gap-3">
              {SECTIONS.slice(0, 4).map((s) => (
                <Link
                  key={s.id}
                  to={s.path}
                  className="text-center p-3 rounded-xl bg-bg-main dark:bg-slate-800/40 hover:bg-primary/5 transition-all"
                >
                  <span className="text-2xl">{s.icon}</span>
                  <p className="text-xs font-medium text-text-muted dark:text-text-muted-dark mt-1">
                    {s.label}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Appearance Tab ── */}
      {activeTab === "appearance" && (
        <div className="dash-card space-y-6">
          <h3 className="text-sm font-bold text-text-main dark:text-text-main-dark">
            Appearance
          </h3>

          <div className="flex items-center justify-between py-3 border-b border-border dark:border-border-dark">
            <div>
              <p className="text-sm font-semibold text-text-main dark:text-text-main-dark">
                Dark Mode
              </p>
              <p className="text-xs text-text-muted dark:text-text-muted-dark">
                Switch between dark and light theme
              </p>
            </div>
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${theme === "dark" ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"}`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${theme === "dark" ? "translate-x-6" : "translate-x-0.5"}`}
              />
            </button>
          </div>

          <div>
            <p className="text-sm font-semibold text-text-main dark:text-text-main-dark mb-1">
              Color Theme
            </p>
            <p className="text-xs text-text-muted dark:text-text-muted-dark mb-3">
              Use the color picker in the sidebar to change the accent color on
              the dashboard and portfolio.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                "#198f51",
                "#2563eb",
                "#7c3aed",
                "#e11d48",
                "#d97706",
                "#0891b2",
              ].map((color) => (
                <div
                  key={color}
                  className="w-8 h-8 rounded-full border-2 border-white/20 shadow cursor-pointer hover:scale-110 transition-transform"
                  style={{ background: color }}
                  title={color}
                />
              ))}
              <span className="text-xs text-text-muted dark:text-text-muted-dark ml-1">
                ← Click the 🎨 icon in sidebar to apply
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-border dark:border-border-dark">
            <div>
              <p className="text-sm font-semibold text-text-main dark:text-text-main-dark">
                Sidebar
              </p>
              <p className="text-xs text-text-muted dark:text-text-muted-dark">
                Click the ← → button in the sidebar to collapse or expand
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Account Tab ── */}
      {activeTab === "account" && (
        <div className="space-y-4">
          <div className="dash-card">
            <h3 className="text-sm font-bold text-text-main dark:text-text-main-dark mb-4">
              Account Settings
            </h3>
            <div className="space-y-3">
              <Link
                to="/profile"
                className="flex items-center justify-between p-4 rounded-xl bg-bg-main dark:bg-slate-800/40 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-main dark:text-text-main-dark group-hover:text-primary">
                      Profile Information
                    </p>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">
                      Update name, avatar
                    </p>
                  </div>
                </div>
                <ExternalLink size={14} className="text-text-muted" />
              </Link>

              <Link
                to="/profile"
                className="flex items-center justify-between p-4 rounded-xl bg-bg-main dark:bg-slate-800/40 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Shield size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-main dark:text-text-main-dark group-hover:text-primary">
                      Password & Security
                    </p>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">
                      Change your password
                    </p>
                  </div>
                </div>
                <ExternalLink size={14} className="text-text-muted" />
              </Link>
            </div>
          </div>

          <div className="dash-card border border-danger/20 bg-danger/5">
            <h3 className="text-sm font-bold text-danger mb-1">Danger Zone</h3>
            <p className="text-xs text-text-muted dark:text-text-muted-dark mb-4">
              These actions are irreversible. Be careful.
            </p>
            <button className="btn-danger text-sm">
              <Bell size={14} /> Clear All Notifications
            </button>
          </div>
        </div>
      )}

      {/* ── About Tab ── */}
      {activeTab === "about" && (
        <div className="dash-card space-y-5">
          <h3 className="text-sm font-bold text-text-main dark:text-text-main-dark">
            About This Dashboard
          </h3>
          <div className="space-y-3 text-sm">
            {[
              { label: "Dashboard", value: "Portfolio Admin v1.0" },
              {
                label: "Tech Stack",
                value: "React 18 + Redux Toolkit + RTK Query",
              },
              {
                label: "Backend",
                value: "Node.js + Express + Prisma + MongoDB",
              },
              { label: "Developer", value: "Shipon Hossen Raju" },
              { label: "Portfolio URL", value: PORTFOLIO_URL },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2 border-b border-border dark:border-border-dark last:border-0"
              >
                <span className="text-text-muted dark:text-text-muted-dark font-medium">
                  {item.label}
                </span>
                <span className="text-text-main dark:text-text-main-dark text-right">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full justify-center"
          >
            <ExternalLink size={14} /> View Live Portfolio
          </a>
        </div>
      )}
    </div>
  );
}
