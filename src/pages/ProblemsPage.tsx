import { Bug, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FormField,
  Input,
  Select,
  TagInput,
  Textarea,
} from "../components/forms";
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
  useCreateProblemMutation,
  useDeleteProblemMutation,
  useGetProblemsQuery,
  useUpdateProblemMutation,
} from "../store/api/endpoints";
import type { Problem, ProblemFormData } from "../types";

const DIFF_OPTIONS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];
const diffVariant = { easy: "green", medium: "amber", hard: "red" } as const;

const empty: ProblemFormData = {
  title: "",
  platform: "Production Bug",
  difficulty: "medium",
  tags: [],
  problem: "",
  solution: "",
  codeSnippet: "",
  solvedAt: new Date().toISOString().slice(0, 10),
  link: "",
};

export default function ProblemsPage() {
  const { data, isLoading } = useGetProblemsQuery();
  const [create, { isLoading: creating }] = useCreateProblemMutation();
  const [update, { isLoading: updating }] = useUpdateProblemMutation();
  const [remove, { isLoading: deleting }] = useDeleteProblemMutation();

  const items = data?.data ?? [];
  const [modal, setModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    data?: Problem;
  }>({ open: false, mode: "create" });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<ProblemFormData>(empty);

  const openCreate = () => {
    setForm(empty);
    setModal({ open: true, mode: "create" });
  };
  const openEdit = (p: Problem) => {
    setForm({
      title: p.title,
      platform: p.platform,
      difficulty: p.difficulty,
      tags: p.tags,
      problem: p.problem,
      solution: p.solution,
      codeSnippet: p.codeSnippet ?? "",
      solvedAt: p.solvedAt?.slice(0, 10) ?? "",
      link: p.link ?? "",
    });
    setModal({ open: true, mode: "edit", data: p });
  };

  const handleSave = async () => {
    if (!form.title || !form.problem || !form.solution) {
      toast.error("Title, problem, and solution are required");
      return;
    }
    try {
      if (modal.mode === "create") {
        await create(form).unwrap();
        toast.success("Problem added!");
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

  const columns = [
    {
      key: "title",
      label: "Problem",
      sortable: true,
      render: (row: Problem) => (
        <div>
          <p className="font-semibold text-text-main dark:text-text-main-dark text-sm">
            {row.title}
          </p>
          <p className="text-xs text-text-muted">{row.platform}</p>
        </div>
      ),
    },
    {
      key: "difficulty",
      label: "Difficulty",
      render: (row: Problem) => (
        <Badge label={row.difficulty} variant={diffVariant[row.difficulty]} />
      ),
    },
    {
      key: "tags",
      label: "Tags",
      render: (row: Problem) => (
        <div className="flex flex-wrap gap-1">
          {row.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium"
            >
              {t}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "solvedAt",
      label: "Solved",
      sortable: true,
      render: (row: Problem) => (
        <span className="text-xs text-text-muted">
          {row.solvedAt
            ? new Date(row.solvedAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      width: "80px",
      render: (row: Problem) => (
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
        title="Problems Solved"
        desc={`${items.length} dev notes`}
        action={
          <button onClick={openCreate} className="btn-primary">
            <Plus size={16} />
            Add Problem
          </button>
        }
      />
      <DataTable
        columns={columns}
        data={items as unknown as Record<string, unknown>[]}
        keyField="id"
        searchable
        searchKeys={["title", "platform"]}
        emptyState={
          <EmptyState
            icon={<Bug size={22} />}
            title="No problems documented"
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
        title={modal.mode === "create" ? "Add Dev Note" : "Edit Dev Note"}
        size="xl"
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
          <FormField label="Title" required>
            <Input
              placeholder="Problem title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Platform">
              <Input
                placeholder="Production Bug, GitHub..."
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
              />
            </FormField>
            <FormField label="Difficulty">
              <Select
                options={DIFF_OPTIONS}
                value={form.difficulty}
                onChange={(e) =>
                  setForm({
                    ...form,
                    difficulty: e.target.value as Problem["difficulty"],
                  })
                }
              />
            </FormField>
          </div>
          <FormField label="Problem" required>
            <Textarea
              placeholder="Describe the problem..."
              value={form.problem}
              onChange={(e) => setForm({ ...form, problem: e.target.value })}
              rows={3}
            />
          </FormField>
          <FormField label="Solution" required>
            <Textarea
              placeholder="How did you solve it?"
              value={form.solution}
              onChange={(e) => setForm({ ...form, solution: e.target.value })}
              rows={3}
            />
          </FormField>
          <FormField label="Code Snippet" hint="Optional code example">
            <Textarea
              placeholder="// Your code here..."
              value={form.codeSnippet ?? ""}
              onChange={(e) =>
                setForm({ ...form, codeSnippet: e.target.value })
              }
              rows={5}
              className="font-mono text-xs"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Solved Date">
              <Input
                type="date"
                value={form.solvedAt}
                onChange={(e) => setForm({ ...form, solvedAt: e.target.value })}
              />
            </FormField>
            <FormField label="Reference Link">
              <Input
                placeholder="https://..."
                value={form.link ?? ""}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
              />
            </FormField>
          </div>
          <FormField label="Tags">
            <TagInput
              tags={form.tags}
              onChange={(t) => setForm({ ...form, tags: t })}
            />
          </FormField>
        </div>
      </Modal>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Dev Note"
        message="Permanently delete this problem?"
        loading={deleting}
      />
    </div>
  );
}
