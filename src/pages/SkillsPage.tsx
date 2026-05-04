import { useState } from "react";
import { Plus, Pencil, Trash2, Zap } from "lucide-react";
import toast from "react-hot-toast";
import {
  Modal,
  ConfirmDialog,
  EmptyState,
  PageHeader,
  PageLoader,
} from "../components/ui";
import DataTable from "../components/ui/DataTable";
import { FormField, Input, Select } from "../components/forms";
import type { Skill, SkillFormData } from "../types";
import clsx from "clsx";
import {
  useCreateSkillMutation,
  useDeleteSkillMutation,
  useGetSkillsQuery,
  useUpdateSkillMutation,
} from "@/store/api/skills.api";

const CATEGORIES = [
  { value: "Languages", label: "Languages" },
  { value: "Frontend", label: "Frontend" },
  { value: "Backend", label: "Backend" },
  { value: "Database", label: "Database" },
  { value: "DevOps", label: "DevOps" },
  { value: "UI Libraries", label: "UI Libraries" },
  { value: "Tools", label: "Tools" },
  { value: "Other", label: "Other" },
];

const empty: SkillFormData = { category: "Frontend", title: "", value: 75 };

const getLevelColor = (v: number) =>
  v >= 80 ? "bg-green-500" : v >= 60 ? "bg-blue-500" : "bg-amber-500";
const getLevel = (v: number) =>
  v >= 80 ? "Expert" : v >= 60 ? "Advanced" : "Intermediate";

export default function SkillsPage() {
  const { data, isLoading } = useGetSkillsQuery();
  const [create, { isLoading: creating }] = useCreateSkillMutation();
  const [update, { isLoading: updating }] = useUpdateSkillMutation();
  const [remove, { isLoading: deleting }] = useDeleteSkillMutation();

  const items = data?.data ?? [];
  const [modal, setModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    data?: Skill;
  }>({ open: false, mode: "create" });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<SkillFormData>(empty);

  const openCreate = () => {
    setForm(empty);
    setModal({ open: true, mode: "create" });
  };
  const openEdit = (s: Skill) => {
    setForm({ category: s.category, title: s.title, value: s.value });
    setModal({ open: true, mode: "edit", data: s });
  };

  const handleSave = async () => {
    if (!form.title) {
      toast.error("Title is required");
      return;
    }
    try {
      if (modal.mode === "create") {
        await create(form).unwrap();
        toast.success("Skill added!");
      } else if (modal.data) {
        await update({ id: modal.data.id, data: form }).unwrap();
        toast.success("Updated!");
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
      toast.error("Failed");
    }
  };

  // Group by category for the visual overview
  const grouped = items.reduce((acc: Record<string, Skill[]>, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  const columns = [
    {
      key: "title",
      label: "Skill",
      sortable: true,
      render: (row: Skill) => (
        <p className="font-semibold text-text-main dark:text-text-main-dark text-sm">
          {row.title}
        </p>
      ),
    },
    { key: "category", label: "Category", sortable: true },
    {
      key: "value",
      label: "Proficiency",
      render: (row: Skill) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden max-w-[100px]">
            <div
              className={clsx("h-full rounded-full", getLevelColor(row.value))}
              style={{ width: `${row.value}%` }}
            />
          </div>
          <span className="text-xs text-text-muted w-8">{row.value}%</span>
          <span
            className={clsx(
              "text-[10px] font-semibold px-1.5 py-0.5 rounded",
              getLevelColor(row.value)
                .replace("bg-", "bg-")
                .replace("-500", "-500/10"),
              "text-current",
            )}
            style={{
              color:
                row.value >= 80
                  ? "#22c55e"
                  : row.value >= 60
                    ? "#3b82f6"
                    : "#f59e0b",
            }}
          >
            {getLevel(row.value)}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "",
      width: "80px",
      render: (row: Skill) => (
        <div className="flex gap-1">
          <button
            onClick={() => openEdit(row)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-info hover:bg-info/10 transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Skills"
        desc={`${items.length} skills across ${Object.keys(grouped).length} categories`}
        action={
          <button onClick={openCreate} className="btn-primary">
            <Plus size={16} />
            Add Skill
          </button>
        }
      />

      {/* Visual skill groups */}
      {Object.keys(grouped).length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Object.entries(grouped).map(([cat, skills]) => (
            <div key={cat} className="dash-card">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted dark:text-text-muted-dark mb-3">
                {cat}
              </p>
              <div className="space-y-2">
                {skills
                  .sort((a, b) => b.value - a.value)
                  .map((s) => (
                    <div key={s.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-text-main dark:text-text-main-dark">
                          {s.title}
                        </span>
                        <span className="text-text-muted">{s.value}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={clsx(
                            "h-full rounded-full transition-all",
                            getLevelColor(s.value),
                          )}
                          style={{ width: `${s.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <DataTable
        columns={columns}
        data={items as unknown as Record<string, unknown>[]}
        keyField="id"
        searchable
        searchKeys={["title", "category"]}
        emptyState={
          <EmptyState
            icon={<Zap size={22} />}
            title="No skills added"
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
        title={modal.mode === "create" ? "Add Skill" : "Edit Skill"}
        size="sm"
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
          <FormField label="Category">
            <Select
              options={CATEGORIES}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </FormField>
          <FormField label="Skill Name" required>
            <Input
              placeholder="React, Node.js, MongoDB..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </FormField>
          <FormField
            label={`Proficiency: ${form.value}%`}
            hint={getLevel(form.value)}
          >
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={form.value}
              onChange={(e) =>
                setForm({ ...form, value: Number(e.target.value) })
              }
              className="w-full h-2 rounded-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-muted mt-1">
              <span>Beginner</span>
              <span>Advanced</span>
              <span>Expert</span>
            </div>
          </FormField>
        </div>
      </Modal>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Skill"
        message="Delete this skill?"
        loading={deleting}
      />
    </div>
  );
}
