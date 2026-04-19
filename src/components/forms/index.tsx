import React from 'react';
import clsx from 'clsx';

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
  hint?: string;
}

export function FormField({ label, required, error, children, className, hint }: FieldProps) {
  return (
    <div className={clsx('space-y-1.5', className)}>
      <label className="text-xs font-semibold text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
        {label}{required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-text-muted dark:text-text-muted-dark">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}
export function Input({ error, className, ...props }: InputProps) {
  return (
    <input {...props} className={clsx('dash-input', error && 'border-danger focus:ring-danger/30', className)} />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}
export function Textarea({ error, className, rows = 4, ...props }: TextareaProps) {
  return (
    <textarea {...props} rows={rows}
      className={clsx('dash-input resize-none', error && 'border-danger focus:ring-danger/30', className)} />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  error?: boolean;
}
export function Select({ options, error, className, ...props }: SelectProps) {
  return (
    <select {...props} className={clsx('dash-input', error && 'border-danger focus:ring-danger/30', className)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// Tag input
interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}
export function TagInput({ tags, onChange, placeholder = 'Add tag, press Enter' }: TagInputProps) {
  const [input, setInput] = React.useState('');
  const addTag = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !tags.includes(trimmed)) onChange([...tags, trimmed]);
    setInput('');
  };
  return (
    <div className="dash-input flex flex-wrap gap-1.5 min-h-[42px] cursor-text p-2" onClick={(e) => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}>
      {tags.map((tag) => (
        <span key={tag} className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-lg font-medium">
          {tag}
          <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))} className="hover:text-danger transition-colors">×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input); }
          if (e.key === 'Backspace' && !input && tags.length) onChange(tags.slice(0, -1));
        }}
        onBlur={() => input && addTag(input)}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] text-xs outline-none bg-transparent text-text-main dark:text-text-main-dark placeholder-text-muted"
      />
    </div>
  );
}

// Switch / Toggle
interface SwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}
export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={clsx('relative w-10 h-5.5 rounded-full transition-colors duration-200 cursor-pointer', checked ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600')}
        style={{ height: '22px' }}
      >
        <div className={clsx('absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform duration-200', checked ? 'translate-x-[22px]' : 'translate-x-0.5')}
          style={{ width: '18px', height: '18px' }}
        />
      </div>
      {label && <span className="text-sm font-medium text-text-main dark:text-text-main-dark">{label}</span>}
    </label>
  );
}
