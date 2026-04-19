import { useState } from 'react';
import { Plus, Pencil, Trash2, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetServicesQuery, useCreateServiceMutation, useUpdateServiceMutation, useDeleteServiceMutation } from '../store/api/endpoints';
import { Modal, ConfirmDialog, EmptyState, PageHeader, PageLoader } from '../components/ui';
import DataTable from '../components/ui/DataTable';
import { FormField, Input, Textarea, TagInput } from '../components/forms';
import type { Service, ServiceFormData } from '../types';

const emptyForm: ServiceFormData = { title: '', description: '', rules: [] };

export default function ServicesPage() {
  const { data, isLoading } = useGetServicesQuery();
  const [create, { isLoading: creating }] = useCreateServiceMutation();
  const [update, { isLoading: updating }] = useUpdateServiceMutation();
  const [remove, { isLoading: deleting }] = useDeleteServiceMutation();

  const items = data?.data ?? [];
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit'; data?: Service }>({ open: false, mode: 'create' });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceFormData>(emptyForm);

  const openCreate = () => { setForm(emptyForm); setModal({ open: true, mode: 'create' }); };
  const openEdit = (s: Service) => { setForm({ title: s.title, description: s.description, rules: s.rules }); setModal({ open: true, mode: 'edit', data: s }); };

  const handleSave = async () => {
    if (!form.title) { toast.error('Title is required'); return; }
    try {
      if (modal.mode === 'create') { await create(form).unwrap(); toast.success('Service created!'); }
      else if (modal.data) { await update({ id: modal.data._id, data: form }).unwrap(); toast.success('Updated!'); }
      setModal({ open: false, mode: 'create' });
    } catch { toast.error('Something went wrong'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await remove(deleteId).unwrap(); toast.success('Deleted'); setDeleteId(null); }
    catch { toast.error('Failed'); }
  };

  const columns = [
    { key: 'title', label: 'Title', sortable: true, render: (row: Service) => <p className="font-semibold text-text-main dark:text-text-main-dark text-sm">{row.title}</p> },
    { key: 'description', label: 'Description', render: (row: Service) => <p className="text-xs text-text-muted dark:text-text-muted-dark line-clamp-2 max-w-xs">{row.description}</p> },
    { key: 'rules', label: 'Technologies', render: (row: Service) => (
      <div className="flex flex-wrap gap-1">
        {row.rules.slice(0, 4).map((r) => <span key={r} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{r}</span>)}
        {row.rules.length > 4 && <span className="text-[10px] text-text-muted">+{row.rules.length - 4}</span>}
      </div>
    )},
    { key: 'actions', label: '', width: '80px', render: (row: Service) => (
      <div className="flex gap-1">
        <button onClick={() => openEdit(row)} className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-info hover:bg-info/10 transition-colors"><Pencil size={13} /></button>
        <button onClick={() => setDeleteId(row._id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"><Trash2 size={13} /></button>
      </div>
    )},
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-5">
      <PageHeader title="Services" desc={`${items.length} services`} action={<button onClick={openCreate} className="btn-primary"><Plus size={16} />Add Service</button>} />
      <DataTable columns={columns} data={items as unknown as Record<string, unknown>[]} keyField="_id" searchable searchKeys={['title']}
        emptyState={<EmptyState icon={<Wrench size={22} />} title="No services" action={<button onClick={openCreate} className="btn-primary"><Plus size={15} />Add</button>} />} />
      <Modal open={modal.open} onClose={() => setModal({ open: false, mode: 'create' })} title={modal.mode === 'create' ? 'Add Service' : 'Edit Service'} size="md"
        footer={<><button onClick={() => setModal({ open: false, mode: 'create' })} className="btn-secondary">Cancel</button><button onClick={handleSave} disabled={creating || updating} className="btn-primary">{(creating || updating) ? 'Saving...' : 'Save'}</button></>}>
        <div className="space-y-4">
          <FormField label="Title" required><Input placeholder="MERN Stack Development" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <FormField label="Description" required><Textarea placeholder="Describe the service..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
          <FormField label="Technologies / Rules"><TagInput tags={form.rules} onChange={(t) => setForm({ ...form, rules: t })} placeholder="React, Node.js, MongoDB..." /></FormField>
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Service" message="Delete this service permanently?" loading={deleting} />
    </div>
  );
}
