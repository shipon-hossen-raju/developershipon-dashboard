import { useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, Bell } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleTheme, toggleSidebar } from '../../store/slices/uiSlice';
import { useGetMessagesQuery } from '../../store/api/endpoints';

const pageTitles: Record<string, { title: string; desc: string }> = {
  '/': { title: 'Dashboard', desc: 'Welcome back, overview of your portfolio' },
  '/projects': { title: 'Projects', desc: 'Manage your portfolio projects' },
  '/experiences': { title: 'Experience', desc: 'Manage your work experience' },
  '/services': { title: 'Services', desc: 'Manage services you offer' },
  '/blogs': { title: 'Blog Posts', desc: 'Manage your blog articles' },
  '/events': { title: 'Events', desc: 'Manage events & activities' },
  '/problems': { title: 'Problem Solving', desc: 'Manage your dev notes & bugs' },
  '/skills': { title: 'Skills', desc: 'Manage your technical skills' },
  '/messages': { title: 'Messages', desc: 'Contact form submissions' },
  '/hire-requests': { title: 'Hire Requests', desc: 'Service hire enquiries' },
};

export default function Topbar() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const location = useLocation();
  const page = pageTitles[location.pathname] ?? { title: 'Dashboard', desc: '' };

  const { data: msgsData } = useGetMessagesQuery();
  const unread = msgsData?.data?.filter((m) => !m.read).length ?? 0;

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-6 bg-surface dark:bg-surface-dark border-b border-border dark:border-border-dark">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text-main hover:bg-bg-main dark:hover:bg-slate-800 transition-colors"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-base font-bold text-text-main dark:text-text-main-dark leading-none">{page.title}</h1>
          <p className="text-xs text-text-muted dark:text-text-muted-dark mt-0.5 hidden sm:block">{page.desc}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted dark:text-text-muted-dark hover:bg-bg-main dark:hover:bg-slate-800 transition-colors">
            <Bell size={17} />
          </button>
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full ring-2 ring-surface dark:ring-surface-dark" />
          )}
        </div>

        {/* Theme */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted dark:text-text-muted-dark hover:bg-bg-main dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Date */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg-main dark:bg-slate-800 text-xs font-medium text-text-muted dark:text-text-muted-dark">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>
    </header>
  );
}
