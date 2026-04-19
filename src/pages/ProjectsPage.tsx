import { useState } from 'react';
import { Plus, Pencil, Trash2, Star, ExternalLink, FolderKanban } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetProjectsQuery, useCreateProjectMutation, useUpdateProjectMutation, useDeleteProjectMutation, useToggleProjectFeaturedMutation } from '../store/api/endpoints';
import { Modal, ConfirmDialog, Badge, EmptyState, PageHeader, PageLoader } from '../components/ui';
import DataTable from '../components/ui/DataTable';
import { FormField, Input, Textarea, Select, TagInput, Switch } from '../components/forms';
import type { Project, ProjectFormData } from '../types';

const STATUS_OPTIONS = [
  { value: 'completed', label: 'Completed' },
  { value: 'in progress', label: 'In Progress' },
  { value: 'maintained', label: 'Maintained' },
];
const TYPE_OPTIONS = [
  { value: 'full stack', label: 'Full Stack' },
  { value: 'backend', label: 'Backend' },
  { value: 'frontend', label: 'Frontend' },
];

const statusVariant = { completed: 'green', 'in progress': 'amber', maintained: 'blue' } as const;
const typeVariant = { 'full stack': 'blue', backend: 'amber', frontend: 'purple' } as const;

const emptyForm: ProjectFormData = {
  title: '', tagline: '', description: '', type: 'full stack', image: '',
  liveUrl: '', githubUrl: '', duration: '', completedAt: '',
  status: 'completed', technologies: { frontend: [], backend: [], database: [], other: [] },
  keyFeatures: [], challenges: '', featured: false,
};

export default function ProjectsPage() {
  const { data, isLoading } = useGetProjectsQuery();
  const [createProject, { isLoading: creating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: updating }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: deleting }] = useDeleteProjectMutation();
  const [toggleFeatured] = useToggleProjectFeaturedMutation();

  const projects = data?.data ?? [];
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit'; data?: Project }>({ open: false, mode: 'create' });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectFormData>(emptyForm);

  const openCreate = () => { setForm(emptyForm); setModal({ open: true, mode: 'create' }); };
  const openEdit = (p: Project) => {
    setForm({ title: p.title, tagline: p.tagline, description: p.description, type: p.type, image: p.image ?? '', liveUrl: p.liveUrl ?? '', githubUrl: p.githubUrl ?? '', duration: p.duration, completedAt: p.completedAt, status: p.status, technologies: { frontend: p.technologies.frontend ?? [], backend: p.technologies.backend ?? [], database: p.technologies.database ?? [], other: p.technologies.other ?? [] }, keyFeatures: p.keyFeatures, challenges: p.challenges ?? '', featured: p.featured });
    setModal({ open: true, mode: 'edit', data: p });
  };

  const handleSave = async () => {
    if (!form.title || !form.description) { toast.error('Title and description are required'); return; }
    try {
      if (modal.mode === 'create') {
        await createProject(form).unwrap();
        toast.success('Project created!');
      } else if (modal.data) {
        await updateProject({ id: modal.data._id, data: form }).unwrap();
        toast.success('Project updated!');
      }
      setModal({ open: false, mode: 'create' });
    } catch { toast.error('Something went wrong'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await deleteProject(deleteId).unwrap(); toast.success('Project deleted'); setDeleteId(null); }
    catch { toast.error('Failed to delete'); }
  };

  const columns = [
    { key: 'title', label: 'Project', sortable: true, render: (row: Project) => (
      <div className="flex items-center gap-3">
        {row.featured && <Star size={13} className="text-amber-500 shrink-0" />}
        <div>
          <p className="font-semibold text-text-main dark:text-text-main-dark text-sm">{row.title}</p>
          <p className="text-xs text-text-muted dark:text-text-muted-dark truncate max-w-[200px]">{row.tagline}</p>
        </div>
      </div>
    )},
    { key: 'type', label: 'Type', render: (row: Project) => <Badge label={row.type} variant={typeVariant[row.type]} /> },
    { key: 'status', label: 'Status', render: (row: Project) => <Badge label={row.status} variant={statusVariant[row.status]} dot /> },
    { key: 'technologies', label: 'Stack', render: (row: Project) => (
      <div className="flex flex-wrap gap-1">
        {[...(row.technologies.frontend ?? []), ...(row.technologies.backend ?? [])].slice(0, 3).map((t) => (
          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{t}</span>
        ))}
        {([...(row.technologies.frontend ?? []), ...(row.technologies.backend ?? [])].length > 3) && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-text-muted font-medium">+more</span>
        )}
      </div>
    )},
    { key: 'completedAt', label: 'Completed', sortable: true },
    { key: 'actions', label: 'Actions', width: '140px', render: (row: Project) => (
      <div className="flex items-center gap-1">
        <button onClick={() => toggleFeatured(row._id)} title={row.featured ? 'Unfeature' : 'Feature'} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${row.featured ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'text-text-muted hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'}`}>
          <Star size={13} />
        </button>
        {row.liveUrl && <a href={row.liveUrl} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"><ExternalLink size={13} /></a>}
        <button onClick={() => openEdit(row)} className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-info hover:bg-info/10 transition-colors"><Pencil size={13} /></button>
        <button onClick={() => setDeleteId(row._id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"><Trash2 size={13} /></button>
      </div>
    )},
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-5">
      <PageHeader title="Projects" desc={`${projects.length} projects total`}
        action={<button onClick={openCreate} className="btn-primary"><Plus size={16} />New Project</button>} />

      <DataTable columns={columns} data={projects as unknown as Record<string, unknown>[]} keyField="_id"
        searchable searchPlaceholder="Search projects..." searchKeys={['title', 'tagline', 'type']}
        emptyState={<EmptyState icon={<FolderKanban size={22} />} title="No projects yet" desc="Add your first project" action={<button onClick={openCreate} className="btn-primary"><Plus size={15} />Add Project</button>} />}
      />

      {/* Create / Edit Modal */}
      <Modal open={modal.open} onClose={() => setModal({ open: false, mode: 'create' })}
        title={modal.mode === 'create' ? 'Add New Project' : 'Edit Project'} size="xl"
        footer={
          <>
            <button onClick={() => setModal({ open: false, mode: 'create' })} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={creating || updating} className="btn-primary">
              {(creating || updating) ? 'Saving...' : modal.mode === 'create' ? 'Create Project' : 'Save Changes'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Title" required className="md:col-span-2">
            <Input placeholder="Project title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </FormField>
          <FormField label="Tagline" required className="md:col-span-2">
            <Input placeholder="Short one-liner" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          </FormField>
          <FormField label="Description" required className="md:col-span-2">
            <Textarea placeholder="Full description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </FormField>
          <FormField label="Type">
            <Select options={TYPE_OPTIONS} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ProjectFormData['type'] })} />
          </FormField>
          <FormField label="Status">
            <Select options={STATUS_OPTIONS} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProjectFormData['status'] })} />
          </FormField>
          <FormField label="Duration" hint='e.g. "3 weeks"'>
            <Input placeholder="3 weeks" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </FormField>
          <FormField label="Completed At" hint='e.g. "Dec 2024"'>
            <Input placeholder="Dec 2024" value={form.completedAt} onChange={(e) => setForm({ ...form, completedAt: e.target.value })} />
          </FormField>
          <FormField label="Live URL">
            <Input placeholder="https://" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
          </FormField>
          <FormField label="GitHub URL">
            <Input placeholder="https://github.com/..." value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
          </FormField>
          <FormField label="Frontend Stack" className="md:col-span-2">
            <TagInput tags={form.technologies.frontend ?? []} onChange={(t) => setForm({ ...form, technologies: { ...form.technologies, frontend: t } })} placeholder="React, Next.js, Tailwind..." />
          </FormField>
          <FormField label="Backend Stack" className="md:col-span-2">
            <TagInput tags={form.technologies.backend ?? []} onChange={(t) => setForm({ ...form, technologies: { ...form.technologies, backend: t } })} placeholder="Node.js, Express..." />
          </FormField>
          <FormField label="Database" className="md:col-span-2">
            <TagInput tags={form.technologies.database ?? []} onChange={(t) => setForm({ ...form, technologies: { ...form.technologies, database: t } })} placeholder="MongoDB, PostgreSQL..." />
          </FormField>
          <FormField label="Key Features" className="md:col-span-2">
            <TagInput tags={form.keyFeatures} onChange={(t) => setForm({ ...form, keyFeatures: t })} placeholder="Stripe payments, JWT auth..." />
          </FormField>
          <FormField label="Challenges" className="md:col-span-2">
            <Textarea placeholder="What was the main challenge and how did you solve it?" value={form.challenges} onChange={(e) => setForm({ ...form, challenges: e.target.value })} rows={2} />
          </FormField>
          <FormField label="Featured">
            <Switch checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} label="Show as featured project" />
          </FormField>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Project" message="This will permanently delete the project. This action cannot be undone." loading={deleting} />
    </div>
  );
}
