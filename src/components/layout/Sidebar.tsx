import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  Bug,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  UserCheck,
  Wrench,
  Zap,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  useGetHireRequestsQuery,
  useGetMessagesQuery,
} from "../../store/api/endpoints";
import { clearCredentials } from "../../store/slices/authSlice";
import { toggleSidebar } from "../../store/slices/uiSlice";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/projects", icon: FolderKanban, label: "Projects" },
  { to: "/experiences", icon: Briefcase, label: "Experience" },
  { to: "/services", icon: Wrench, label: "Services" },
  { to: "/blogs", icon: BookOpen, label: "Blogs" },
  { to: "/events", icon: CalendarDays, label: "Events" },
  { to: "/problems", icon: Bug, label: "Problems" },
  { to: "/skills", icon: Zap, label: "Skills" },
];

const inboxItems = [
  {
    to: "/messages",
    icon: MessageSquare,
    label: "Messages",
    badgeKey: "messages",
  },
  {
    to: "/hire-requests",
    icon: UserCheck,
    label: "Hire Requests",
    badgeKey: "hire",
  },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const open = useAppSelector((s) => s.ui.sidebarOpen);
  const user = useAppSelector((s) => s.auth.user);

  const { data: msgsData } = useGetMessagesQuery();
  const { data: hireData } = useGetHireRequestsQuery();

  const unreadMessages = msgsData?.data?.filter((m) => !m.read).length ?? 0;
  const pendingHire =
    hireData?.data?.filter((h) => h.status === "pending").length ?? 0;

  const getBadge = (key: string) => {
    if (key === "messages") return unreadMessages;
    if (key === "hire") return pendingHire;
    return 0;
  };

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/login");
  };

  return (
    <motion.aside
      animate={{ width: open ? 240 : 72 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="relative h-screen bg-sidebar flex flex-col overflow-hidden shrink-0 shadow-sidebar"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-white/5 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
          {/* <span className="text-white font-bold text-sm">S</span> */}
          <img src={`${user.avatar}`} alt="logo" className="w-6 h-6" />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="ml-3 overflow-hidden"
            >
              <p className="text-white font-bold text-sm leading-none">
                {user?.name.split(" ")[0]}
              </p>
              <p className="text-slate-400 text-xs mt-0.5">Portfolio Admin</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse button */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
        >
          {open ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-none">
        {/* Main */}
        <div className="mb-2">
          {open && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 py-1.5">
              Main
            </p>
          )}
          {navItems.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""} ${!open ? "justify-center" : ""}`
              }
              title={!open ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              <AnimatePresence>
                {open && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="text-sm leading-none"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </div>

        {/* Inbox */}
        <div className="pt-2 border-t border-white/5">
          {open && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 py-1.5 mt-1">
              Inbox
            </p>
          )}
          {inboxItems.map(({ to, icon: Icon, label, badgeKey }) => {
            const count = getBadge(badgeKey);
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""} ${!open ? "justify-center" : ""}`
                }
                title={!open ? label : undefined}
              >
                <div className="relative shrink-0">
                  <Icon size={18} />
                  {count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                      {count}
                    </span>
                  )}
                </div>
                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-between flex-1 overflow-hidden"
                    >
                      <span className="text-sm leading-none">{label}</span>
                      {count > 0 && (
                        <span className="ml-auto bg-primary/20 text-primary text-xs font-bold px-1.5 py-0.5 rounded-full">
                          {count}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-white/5 p-2 space-y-1">
        {/* View portfolio */}
        <a
          href="https://developershipon.vercel.app"
          target="_blank"
          rel="noreferrer"
          className={`sidebar-link ${!open ? "justify-center" : ""}`}
          title={!open ? "View Portfolio" : undefined}
        >
          <ExternalLink size={17} className="shrink-0" />
          <AnimatePresence>
            {open && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm"
              >
                View Portfolio
              </motion.span>
            )}
          </AnimatePresence>
        </a>

        {/* User + Logout */}
        <div
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl ${!open ? "justify-center" : ""}`}
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() ?? "S"}
            </span>
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-white text-xs font-semibold truncate">
                  {user?.name ?? "Shipon"}
                </p>
                <p className="text-slate-500 text-[10px] truncate">
                  {user?.email ?? "admin"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={handleLogout}
            title="Logout"
            className="shrink-0 text-slate-500 hover:text-danger transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
