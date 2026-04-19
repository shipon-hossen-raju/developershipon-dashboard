import { useState } from 'react';
import { Plus, Pencil, Trash2, CalendarDays, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetEventsQuery, useCreateEventMutation, useUpdateEventMutation, useDeleteEventMutation } from '../store/api/endpoints';
import { Modal, ConfirmDialog, Badge, EmptyState, PageHeader, PageLoader } from '../components/ui';
import DataTable from '../components/ui/DataTable';
import { FormField, Input, Textarea, TagInput, Switch, Select } from '../components/forms';
import type { PortfolioEvent, EventFormData } from '../types';

const ROLES = [
  { value: 'Participant', label: 'Participant' }, { value: 'Speaker', label: 'Speaker' },
  { value: 'Trainer', label: 'Trainer' }, { value: 'Attendee', label: 'Attendee' },
  { value: 'Contributor', label: 'Contributor' }, { value: 'Mentor', label: 'Mentor' },
];

const emptyEv: EventFormData = { title: '', organizer: '', location: '', date: '', role: 'Participant', description: '', tags: [], highlight: false };

export default function EventsPage() {
  const { data, isLoading } = useGetEventsQuery();
  const [create, { isLoading: creating }] = useCreateEventMutation();
  const [update, { isLoading: updating }] = useUpdateEventMutation();
  const [remove, { isLoading: deleting }] = useDeleteEventMutation();

  const items = data?.data ?? [];
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit'; data?: PortfolioEvent }>({ open: false, mode: 'create' });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<EventFormData>(emptyEv);

  const openCreate = () => { setForm(emptyEv); setModal({ open: true, mode: 'create' }); };
  const openEdit = (ev: PortfolioEvent) => {
    setForm({ title: ev.title, organizer: ev.organizer, location: ev.location, date: ev.date, role: ev.role, description: ev.description, tags: ev.tags, highlight: ev.highlight, image: ev.image ?? '', certificate: ev.certificate ?? '' });
    setModal({ open: true, mode: 'edit', data: ev });
  };

  const handleSave = async () => {
    if (!form.title || !form.organizer) { toast.error('Title and organizer are required'); return; }
    try {
      if (modal.mode === 'create') { await create(form).unwrap(); toast.success('Event added!'); }
      else if (modal.data) { await update({ id: modal.data._id, data: form }).unwrap(); toast.success('Updated!'); }
      setModal({ open: false, mode: 'create' });
    } catch { toast.error('Something went wrong'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await remove(deleteId).unwrap(); toast.success('Deleted'); setDeleteId(null); }
    catch { toast.error('Failed'); }
  };

  const roleColors: Record<string, 'green' | 'blue' | 'purple' | 'gray' | 'amber'> = {
    Trainer: 'green', Speaker: 'purple', Participant: 'blue', Attendee: 'gray', Contributor: 'amber', Mentor: 'green',
  };

  const columns = [
    { key: 'title', label: 'Event', sortable: true, render: (row: PortfolioEvent) => (
      <div className="flex items-center gap-2">
        {row.highlight && <Star size={12} className="text-amber-500 shrink-0" />}
        <div><p className="font-semibold text-text-main dark:text-text-main-dark text-sm">{row.title}</p>
          <p className="text-xs text-text-muted">{row.organizer}</p></div>
      </div>
    )},
    { key: 'role', label: 'Role', render: (row: PortfolioEvent) => <Badge label={row.role} variant={roleColors[row.role] ?? 'gray'} /> },
    { key: 'location', label: 'Location' },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'tags', label: 'Tags', render: (row: PortfolioEvent) => (
      <div className="flex flex-wrap gap-1">{row.tags.slice(0, 3).map((t) => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{t}</span>)}</div>
    )},
    { key: 'actions', label: '', width: '80px', render: (row: PortfolioEvent) => (
      <div className="flex gap-1">
        <button onClick={() => openEdit(row)} className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-info hover:bg-info/10 transition-colors"><Pencil size={13} /></button>
        <button onClick={() => setDeleteId(row._id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"><Trash2 size={13} /></button>
      </div>
    )},
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-5">
      <PageHeader title="Events" desc={`${items.length} events · ${items.filter((e) => e.highlight).length} featured`}
        action={<button onClick={openCreate} className="btn-primary"><Plus size={16} />Add Event</button>} />
      <DataTable columns={columns} data={items as unknown as Record<string, unknown>[]} keyField="_id" searchable searchKeys={['title', 'organizer', 'role']}
        emptyState={<EmptyState icon={<CalendarDays size={22} />} title="No events" action={<button onClick={openCreate} className="btn-primary"><Plus size={15} />Add</button>} />} />

      <Modal open={modal.open} onClose={() => setModal({ open: false, mode: 'create' })} title={modal.mode === 'create' ? 'Add Event' : 'Edit Event'} size="lg"
        footer={<><button onClick={() => setModal({ open: false, mode: 'create' })} className="btn-secondary">Cancel</button><button onClick={handleSave} disabled={creating || updating} className="btn-primary">{(creating || updating) ? 'Saving...' : 'Save'}</button></>}>
        <div className="space-y-4">
          <FormField label="Event Title" required><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Organizer" required><Input value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} /></FormField>
            <FormField label="Location"><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date" hint='e.g. "March 2024"'><Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></FormField>
            <FormField label="Your Role"><Select options={ROLES} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></FormField>
          </div>
          <FormField label="Description"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></FormField>
          <FormField label="Certificate URL"><Input placeholder="https://..." value={form.certificate ?? ''} onChange={(e) => setForm({ ...form, certificate: e.target.value })} /></FormField>
          <FormField label="Tags"><TagInput tags={form.tags} onChange={(t) => setForm({ ...form, tags: t })} /></FormField>
          <Switch checked={form.highlight} onChange={(v) => setForm({ ...form, highlight: v })} label="Pin as featured event" />
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Event" message="Permanently delete this event?" loading={deleting} />
    </div>
  );
}
