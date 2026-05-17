// ─── ExperiencesPage ──────────────────────────────────────────────────────────
import { Briefcase, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FormField, Input, Switch, Textarea } from "../components/forms";
import {
  Badge,
  ConfirmDialog,
  EmptyState,
  Modal,
  PageHeader,
  PageLoader,
} from "../components/ui";
import DataTable from "../components/ui/DataTable";
import {
  useCreateExperienceMutation,
  useDeleteExperienceMutation,
  useGetExperiencesQuery,
  useUpdateExperienceMutation,
} from "../store/api/endpoints";
import type { Experience, ExperienceFormData } from "../types";

const emptyExp: ExperienceFormData = {
  companyName: "",
  jobTitle: "",
  description: "",
  link: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

export default function ExperiencesPage() {
  const { data, isLoading } = useGetExperiencesQuery();
  const [create, { isLoading: creating }] = useCreateExperienceMutation();
  const [update, { isLoading: updating }] = useUpdateExperienceMutation();
  const [remove, { isLoading: deleting }] = useDeleteExperienceMutation();

  const items = data?.data ?? [];
  const [modal, setModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    data?: Experience;
  }>({ open: false, mode: "create" });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<ExperienceFormData>(emptyExp);

  const openCreate = () => {
    setForm(emptyExp);
    setModal({ open: true, mode: "create" });
  };
  const openEdit = (e: Experience) => {
    setForm({
      companyName: e.companyName,
      jobTitle: e.jobTitle,
      description: e.description,
      link: e.link ?? "",
      endDate: e.endDate,
      startDate: e.startDate,
      isActive: e.isActive,
    });
    setModal({ open: true, mode: "edit", data: e });
  };

  const handleSave = async () => {
    if (!form.companyName || !form.jobTitle) {
      toast.error("Company and job title are required");
      return;
    }
    try {
      if (modal.mode === "create") {
        await create(form).unwrap();
        toast.success("Experience added!");
      } else if (modal.data) {
        await update({ id: modal.data.id, data: form }).unwrap();
        toast.success("Experience updated!");
      }
      setModal({ open: false, mode: "create" });
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await remove(deleteId).unwrap();
      toast.success("Deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const fmtDate = (d: string) =>
    d === "current"
      ? "Present"
      : d
        ? new Date(d).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        : "—";

  const columns = [
    {
      key: "companyName",
      label: "Company",
      sortable: true,
      render: (row: unknown) => {
        const experience = row as Experience;

        return (
          <div>
            <p className="font-semibold text-text-main dark:text-text-main-dark text-sm line-clamp-1">
              {experience.companyName}
            </p>

            {experience.link && (
              <a
                href={experience.link}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary hover:underline line-clamp-1"
              >
                {experience.link}
              </a>
            )}
          </div>
        );
      },
    },

    {
      key: "jobTitle",
      label: "Role",
      render: (row: unknown) => {
        const experience = row as Experience;

        return <Badge label={experience.jobTitle} variant="blue" />;
      },
    },

    {
      key: "dateLine",
      label: "Duration",
      render: (row: unknown) => {
        const experience = row as Experience;

        return (
          <span className="text-xs text-text-muted dark:text-text-muted-dark">
            {fmtDate(experience.startDate)} — {fmtDate(experience.endDate)}
          </span>
        );
      },
    },

    {
      key: "description",
      label: "Description",
      render: (row: unknown) => {
        const experience = row as Experience;

        return (
          <p className="text-xs text-text-muted dark:text-text-muted-dark line-clamp-2 max-w-xs">
            {experience.description}
          </p>
        );
      },
    },

    {
      key: "actions",
      label: "",
      width: "80px",
      render: (row: unknown) => {
        const experience = row as Experience;

        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => openEdit(experience)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-info hover:bg-info/10 transition-colors"
            >
              <Pencil size={13} />
            </button>

            <button
              onClick={() => setDeleteId(experience.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        );
      },
    },
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Experience"
        desc={`${items.length} entries`}
        action={
          <button onClick={openCreate} className="btn-primary">
            <Plus size={16} />
            Add Experience
          </button>
        }
      />
      <DataTable
        columns={columns}
        data={items as unknown as Record<string, unknown>[]}
        keyField="id"
        searchable
        searchKeys={["companyName", "jobTitle"]}
        emptyState={
          <EmptyState
            icon={<Briefcase size={22} />}
            title="No experience added"
            action={
              <button onClick={openCreate} className="btn-primary">
                <Plus size={15} />
                Add
              </button>
            }
          />
        }
      />

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, mode: "create" })}
        title={modal.mode === "create" ? "Add Experience" : "Edit Experience"}
        size="lg"
        footer={
          <>
            <button
              onClick={() => setModal({ open: false, mode: "create" })}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={creating || updating}
              className="btn-primary"
            >
              {creating || updating ? "Saving..." : "Save"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Company Name" required>
            <Input
              placeholder="Company Name || City"
              value={form.companyName}
              onChange={(e) =>
                setForm({ ...form, companyName: e.target.value })
              }
            />
          </FormField>
          <FormField label="Job Title" required>
            <Input
              placeholder="Full Stack Developer"
              value={form.jobTitle}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
            />
          </FormField>
          <FormField label="Company Website">
            <Input
              placeholder="https://..."
              value={form.link ?? ""}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date">
              <Input
                type="date"
                value={form.startDate?.toString().slice(0, 10)}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startDate: e.target.value,
                  })
                }
              />
            </FormField>
            <FormField label='End Date (or "current")'>
              <Input
                placeholder='YYYY-MM-DD or "current"'
                value={form.endDate?.toString()}
                onChange={(e) =>
                  setForm({
                    ...form,
                    endDate: e.target.value,
                  })
                }
              />
            </FormField>
          </div>
          <FormField label="Description" required>
            <Textarea
              placeholder="What did you do there?"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
            />
          </FormField>

          <FormField label="Active">
            <Switch
              checked={form.isActive}
              onChange={(v) => setForm({ ...form, isActive: v })}
              label="Active"
            />
          </FormField>
        </div>
      </Modal>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Experience"
        message="Permanently delete this experience entry?"
        loading={deleting}
      />
    </div>
  );
}
