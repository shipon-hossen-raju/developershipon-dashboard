import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import clsx from 'clsx';

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const sizeMap = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export function Modal({ open, onClose, title, size = 'md', children, footer }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className={clsx(
              'relative z-10 w-full bg-surface dark:bg-surface-dark rounded-2xl shadow-2xl border border-border dark:border-border-dark overflow-hidden',
              sizeMap[size]
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border dark:border-border-dark">
              <h2 className="text-base font-bold text-text-main dark:text-text-main-dark">{title}</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-text-muted hover:text-text-main dark:hover:text-text-main-dark hover:bg-bg-main dark:hover:bg-slate-800 transition-colors">
                <X size={16} />
              </button>
            </div>
            {/* Body */}
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border dark:border-border-dark bg-bg-main/50 dark:bg-slate-800/30">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
interface ConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
  variant?: 'danger' | 'warning';
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, loading, variant = 'danger' }: ConfirmProps) {
  return (
    <Modal open={open} onClose={onClose} title="" size="sm"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary" disabled={loading}>Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className={clsx('btn-primary', variant === 'danger' ? 'bg-danger hover:bg-red-600' : 'bg-warning hover:bg-amber-500')}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : null}
            Confirm
          </button>
        </>
      }
    >
      <div className="flex gap-4 items-start py-2">
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', variant === 'danger' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning')}>
          <AlertTriangle size={20} />
        </div>
        <div>
          <p className="font-bold text-text-main dark:text-text-main-dark mb-1">{title}</p>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">{message}</p>
        </div>
      </div>
    </Modal>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeVariant = 'green' | 'blue' | 'amber' | 'red' | 'gray' | 'purple';
const badgeStyles: Record<BadgeVariant, string> = {
  green:  'bg-green-500/10 text-green-600 dark:text-green-400',
  blue:   'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  amber:  'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  red:    'bg-red-500/10 text-red-600 dark:text-red-400',
  gray:   'bg-slate-200 dark:bg-slate-700 text-text-muted dark:text-text-muted-dark',
  purple: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
};

export function Badge({ label, variant = 'gray', dot }: { label: string; variant?: BadgeVariant; dot?: boolean }) {
  return (
    <span className={clsx('badge', badgeStyles[variant])}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', `bg-current`)} />}
      {label}
    </span>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return <Loader2 size={size} className="animate-spin text-primary" />;
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, desc, action }: { icon?: React.ReactNode; title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">{icon}</div>}
      <p className="font-bold text-text-main dark:text-text-main-dark mb-1">{title}</p>
      {desc && <p className="text-sm text-text-muted dark:text-text-muted-dark mb-4">{desc}</p>}
      {action}
    </div>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────
export function PageHeader({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-text-main dark:text-text-main-dark">{title}</h2>
        {desc && <p className="text-sm text-text-muted dark:text-text-muted-dark mt-0.5">{desc}</p>}
      </div>
      {action && <div className="ml-4 shrink-0">{action}</div>}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon, color, delta }: {
  label: string; value: number | string; icon: React.ReactNode;
  color?: string; delta?: { value: number; label: string };
}) {
  return (
    <div className="dash-card stat-animate">
      <div className="flex items-start justify-between mb-4">
        <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center', color ?? 'bg-primary/10 text-primary')}>
          {icon}
        </div>
        {delta && (
          <span className={clsx('text-xs font-semibold px-2 py-1 rounded-full', delta.value >= 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600')}>
            {delta.value >= 0 ? '+' : ''}{delta.value} {delta.label}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-text-main dark:text-text-main-dark">{value}</p>
      <p className="text-sm text-text-muted dark:text-text-muted-dark mt-0.5">{label}</p>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl', className)} />;
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <Spinner size={28} />
        <p className="text-sm text-text-muted dark:text-text-muted-dark">Loading...</p>
      </div>
    </div>
  );
}
