import { useState } from "react";
import { Plus, Pencil, Trash2, BookOpen, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useToggleBlogPublishedMutation,
} from "../store/api/endpoints";
import {
  Modal,
  ConfirmDialog,
  Badge,
  EmptyState,
  PageHeader,
  PageLoader,
} from "../components/ui";
import DataTable from "../components/ui/DataTable";
import {
  FormField,
  Input,
  Textarea,
  TagInput,
  Switch,
} from "../components/forms";
import type { Blog, BlogFormData } from "../types";

const empty: BlogFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  tags: [],
  publishedAt: new Date().toISOString().slice(0, 10),
  readTime: 5,
  featured: false,
  published: false,
};

export default function BlogsPage() {
  const { data, isLoading } = useGetBlogsQuery();
  const [create, { isLoading: creating }] = useCreateBlogMutation();
  const [update, { isLoading: updating }] = useUpdateBlogMutation();
  const [remove, { isLoading: deleting }] = useDeleteBlogMutation();
  const [togglePublish] = useToggleBlogPublishedMutation();

  const items = data?.data ?? [];
  const [modal, setModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    data?: Blog;
  }>({ open: false, mode: "create" });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogFormData>(empty);

  const openCreate = () => {
    setForm(empty);
    setModal({ open: true, mode: "create" });
  };
  const openEdit = (b: Blog) => {
    setForm({
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      content: b.content ?? "",
      tags: b.tags,
      publishedAt: b.publishedAt?.slice(0, 10) ?? "",
      readTime: b.readTime,
      featured: b.featured,
      published: b.published,
    });
    setModal({ open: true, mode: "edit", data: b });
  };

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleSave = async () => {
    if (!form.title || !form.excerpt) {
      toast.error("Title and excerpt are required");
      return;
    }
    try {
      if (modal.mode === "create") {
        await create(form).unwrap();
        toast.success("Blog created!");
      } else if (modal.data) {
        await update({ id: modal.data._id, data: form }).unwrap();
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
      label: "Title",
      sortable: true,
      render: (row: Blog) => (
        <div>
          <p className="font-semibold text-text-main dark:text-text-main-dark text-sm line-clamp-1">
            {row.title}
          </p>
          <p className="text-xs text-text-muted">{row.slug}</p>
        </div>
      ),
    },
    {
      key: "tags",
      label: "Tags",
      render: (row: Blog) => (
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
      key: "readTime",
      label: "Read Time",
      render: (row: Blog) => (
        <span className="text-xs text-text-muted">{row.readTime} min</span>
      ),
    },
    {
      key: "featured",
      label: "Featured",
      render: (row: Blog) =>
        row.featured ? (
          <Badge label="Yes" variant="amber" />
        ) : (
          <Badge label="No" variant="gray" />
        ),
    },
    {
      key: "published",
      label: "Status",
      render: (row: Blog) =>
        row.published ? (
          <Badge label="Published" variant="green" dot />
        ) : (
          <Badge label="Draft" variant="gray" dot />
        ),
    },
    {
      key: "publishedAt",
      label: "Date",
      sortable: true,
      render: (row: Blog) => (
        <span className="text-xs text-text-muted">
          {new Date(row.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      width: "100px",
      render: (row: Blog) => (
        <div className="flex gap-1">
          <button
            onClick={() => togglePublish(row._id)}
            title={row.published ? "Unpublish" : "Publish"}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
          >
            {row.published ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
          <button
            onClick={() => openEdit(row)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-info hover:bg-info/10 transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => setDeleteId(row._id)}
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
        title="Blog Posts"
        desc={`${items.length} posts · ${items.filter((b) => b.published).length} published`}
        action={
          <button onClick={openCreate} className="btn-primary">
            <Plus size={16} />
            New Post
          </button>
        }
      />
      <DataTable
        columns={columns}
        data={items as unknown as Record<string, unknown>[]}
        keyField="_id"
        searchable
        searchKeys={["title", "slug"]}
        emptyState={
          <EmptyState
            icon={<BookOpen size={22} />}
            title="No blog posts"
            action={
              <button onClick={openCreate} className="btn-primary">
                <Plus size={15} />
                Write
              </button>
            }
          />
        }
      />

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, mode: "create" })}
        title={modal.mode === "create" ? "New Blog Post" : "Edit Blog Post"}
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
              placeholder="Post title"
              value={form.title}
              onChange={(e) => {
                const t = e.target.value;
                setForm({ ...form, title: t, slug: generateSlug(t) });
              }}
            />
          </FormField>
          <FormField label="Slug" hint="Auto-generated from title">
            <Input
              placeholder="post-slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </FormField>
          <FormField label="Excerpt" required>
            <Textarea
              placeholder="Short summary..."
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
            />
          </FormField>
          <FormField
            label="Content"
            hint="Full article content (Markdown supported)"
          >
            <Textarea
              placeholder="Write your article..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={8}
            />
          </FormField>
          <FormField label="Tags">
            <TagInput
              tags={form.tags}
              onChange={(t) => setForm({ ...form, tags: t })}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Published At">
              <Input
                type="date"
                value={form.publishedAt}
                onChange={(e) =>
                  setForm({ ...form, publishedAt: e.target.value })
                }
              />
            </FormField>
            <FormField label="Read Time (minutes)">
              <Input
                type="number"
                min={1}
                value={form.readTime}
                onChange={(e) =>
                  setForm({ ...form, readTime: Number(e.target.value) })
                }
              />
            </FormField>
          </div>
          <div className="flex gap-6">
            <Switch
              checked={form.featured}
              onChange={(v) => setForm({ ...form, featured: v })}
              label="Featured post"
            />
            <Switch
              checked={form.published}
              onChange={(v) => setForm({ ...form, published: v })}
              label="Published"
            />
          </div>
        </div>
      </Modal>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Post"
        message="Permanently delete this blog post?"
        loading={deleting}
      />
    </div>
  );
}
