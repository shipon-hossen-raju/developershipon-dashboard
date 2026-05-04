import {
  useCreateCategoriesMutation,
  useDeleteCategoriesMutation,
  useGetCategoriesQuery,
  useUpdateCategoriesMutation,
} from "@/store/api/categories.api";
import { Pencil, Plus, Trash2, Zap } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FormField, Input } from "../components/forms";
import {
  ConfirmDialog,
  EmptyState,
  Modal,
  PageHeader,
  PageLoader,
} from "../components/ui";
import DataTable from "../components/ui/DataTable";
import type { Categories, CategoryFormData } from "../types";

const empty: CategoryFormData = {
  title: "",
};

export default function CategoriesPage() {
  const { data, isLoading } = useGetCategoriesQuery();
  const [create, { isLoading: creating }] = useCreateCategoriesMutation();
  const [update, { isLoading: updating }] = useUpdateCategoriesMutation();
  const [remove, { isLoading: deleting }] = useDeleteCategoriesMutation();
  const items = data?.data ?? [];
  const [modal, setModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    data?: Categories;
  }>({ open: false, mode: "create" });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormData>(empty);

  const openCreate = () => {
    setForm(empty);
    setModal({ open: true, mode: "create" });
  };
  const openEdit = (s: Categories) => {
    setForm({ title: s.title });
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
        toast.success("Categories added!");
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
  // const grouped = items.reduce((acc: Record<string, Categories[]>, s) => {
  //   (acc[s.] ??= []).push(s);
  //   return acc;
  // }, {});

  const columns = [
    {
      key: "title",
      label: "Categories",
      sortable: true,
      render: (row: unknown) => {
        const skill = row as Categories;
        return (
          <p className="font-semibold text-text-main dark:text-text-main-dark text-sm">
            {skill.title}
          </p>
        );
      },
    },
    { key: "category", label: "Category", sortable: true },
    {
      key: "actions",
      label: "",
      width: "80px",
      render: (row: unknown) => {
        const skill = row as Categories;
        return (
          <div className="flex gap-1">
            <button
              onClick={() => openEdit(skill)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-info hover:bg-info/10 transition-colors"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => setDeleteId(skill.id)}
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
        title="Categories"
        desc={`${items.length} Categories across ${Object.keys(items).length} categories`}
        action={
          <button onClick={openCreate} className="btn-primary">
            <Plus size={16} />
            Add Categories
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={items as unknown as Record<string, unknown>[]}
        keyField="id"
        searchable
        searchKeys={["title"]}
        emptyState={
          <EmptyState
            icon={<Zap size={22} />}
            title="No Categories added"
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
        title={modal.mode === "create" ? "Add Categories" : "Edit Categories"}
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
          <FormField label="Categories Name" required>
            <Input
              placeholder="React, Node.js, MongoDB..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </FormField>
        </div>
      </Modal>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Categories"
        message="Delete this skill?"
        loading={deleting}
      />
    </div>
  );
}
