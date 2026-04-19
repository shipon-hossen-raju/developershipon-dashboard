import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  pageSize?: number;
  loading?: boolean;
  emptyState?: React.ReactNode;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns, data, keyField, searchable, searchPlaceholder = 'Search...', searchKeys = [],
  pageSize = 10, loading, emptyState,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  // Filter
  const filtered = search && searchKeys.length > 0
    ? data.filter((row) =>
        searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  // Sort
  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = String(a[sortKey] ?? ''), bv = String(b[sortKey] ?? '');
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      })
    : filtered;

  // Paginate
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  return (
    <div className="dash-card p-0 overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-border dark:border-border-dark">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={searchPlaceholder}
              className="dash-input pl-9 py-2 text-sm"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full dash-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                  {col.sortable ? (
                    <button onClick={() => handleSort(col.key)} className="flex items-center gap-1 hover:text-text-main dark:hover:text-text-main-dark transition-colors">
                      {col.label}
                      <span className="flex flex-col">
                        <ChevronUp size={10} className={sortKey === col.key && sortDir === 'asc' ? 'text-primary' : 'opacity-30'} />
                        <ChevronDown size={10} className={sortKey === col.key && sortDir === 'desc' ? 'text-primary' : 'opacity-30'} style={{ marginTop: -2 }} />
                      </span>
                    </button>
                  ) : col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  {emptyState ?? <span className="text-text-muted dark:text-text-muted-dark">No data found</span>}
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={String(row[keyField as string])}>
                  {columns.map((col) => (
                    <td key={col.key} className={col.className}>
                      {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border dark:border-border-dark">
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg-main dark:hover:bg-slate-800 disabled:opacity-30 transition-colors">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const p = i + Math.max(1, Math.min(page - 2, totalPages - 4));
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={clsx('w-8 h-8 rounded-lg text-xs font-semibold transition-colors',
                    p === page ? 'bg-primary text-white' : 'text-text-muted hover:bg-bg-main dark:hover:bg-slate-800')}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg-main dark:hover:bg-slate-800 disabled:opacity-30 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
