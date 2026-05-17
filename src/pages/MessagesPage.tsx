import { Mail, MessageSquare, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
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
  useDeleteMessageMutation,
  useGetMessagesQuery,
  useMarkMessageReadMutation,
} from "../store/api/endpoints";
import type { ContactMessage } from "../types";

export default function MessagesPage() {
  const { data, isLoading } = useGetMessagesQuery();
  const [markRead] = useMarkMessageReadMutation();
  const [remove, { isLoading: deleting }] = useDeleteMessageMutation();

  const items = data?.data ?? [];
  const [viewing, setViewing] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleView = async (msg: ContactMessage) => {
    setViewing(msg);
    if (!msg.read) {
      try {
        await markRead(msg.id).unwrap();
      } catch {
        /**/
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await remove(deleteId).unwrap();
      toast.success("Deleted");
      setDeleteId(null);
      if (viewing?.id === deleteId) setViewing(null);
    } catch {
      toast.error("Failed");
    }
  };

  const unread = items.filter((m) => !m.read).length;

  const columns = [
    {
      key: "read",
      label: "",
      width: "40px",
      render: (row: unknown) => {
        const message = row as ContactMessage;

        return (
          <div
            className={`w-2 h-2 rounded-full mx-auto ${
              message.read ? "bg-transparent" : "bg-primary"
            }`}
          />
        );
      },
    },

    {
      key: "name",
      label: "From",
      sortable: true,
      render: (row: unknown) => {
        const message = row as ContactMessage;

        return (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
              {message.name[0].toUpperCase()}
            </div>

            <div>
              <p
                className={`text-sm ${
                  !message.read
                    ? "font-bold text-text-main dark:text-text-main-dark"
                    : "font-medium text-text-muted dark:text-text-muted-dark"
                }`}
              >
                {message.name}
              </p>

              <p className="text-xs text-text-muted line-clamp-1">
                {message.email}
              </p>
            </div>
          </div>
        );
      },
    },

    {
      key: "subject",
      label: "Subject",
      sortable: true,
      render: (row: unknown) => {
        const message = row as ContactMessage;

        return (
          <p
            className={`text-sm truncate max-w-[200px] ${
              !message.read ? "font-semibold" : ""
            }`}
          >
            {message.subject}
          </p>
        );
      },
    },

    {
      key: "read",
      label: "Status",
      render: (row: unknown) => {
        const message = row as ContactMessage;

        return message.read ? (
          <Badge label="Read" variant="gray" />
        ) : (
          <Badge label="Unread" variant="green" dot />
        );
      },
    },

    {
      key: "createdAt",
      label: "Received",
      sortable: true,
      render: (row: unknown) => {
        const message = row as ContactMessage;

        return (
          <span className="text-xs text-text-muted">
            {new Date(message.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        );
      },
    },

    {
      key: "actions",
      label: "",
      width: "80px",
      render: (row: unknown) => {
        const message = row as ContactMessage;

        return (
          <div className="flex gap-1">
            <button
              onClick={() => handleView(message)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <Mail size={13} />
            </button>

            <button
              onClick={() => setDeleteId(message.id)}
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
        title="Messages"
        desc={`${items.length} total · ${unread} unread`}
      />
      <DataTable
        columns={columns}
        data={items as unknown as Record<string, unknown>[]}
        keyField="id"
        searchable
        searchPlaceholder="Search messages..."
        searchKeys={["name", "email", "subject"]}
        emptyState={
          <EmptyState
            icon={<MessageSquare size={22} />}
            title="No messages yet"
            desc="Contact form submissions will appear here"
          />
        }
      />

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title="Message Details"
        size="md"
        footer={
          <>
            <button
              onClick={() => {
                setDeleteId(viewing!.id);
                setViewing(null);
              }}
              className="btn-danger"
            >
              <Trash2 size={14} />
              Delete
            </button>
            <button onClick={() => setViewing(null)} className="btn-secondary">
              Close
            </button>
          </>
        }
      >
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-main dark:bg-slate-800/50">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {viewing.name[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-text-main dark:text-text-main-dark">
                  {viewing.name}
                </p>
                <p className="text-sm text-text-muted">
                  {viewing.email}
                  {viewing.contactNumber && ` · ${viewing.contactNumber}`}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                Subject
              </p>
              <p className="font-semibold text-text-main dark:text-text-main-dark">
                {viewing.subject}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                Message
              </p>
              <p className="text-sm text-text-muted dark:text-text-muted-dark leading-relaxed bg-bg-main dark:bg-slate-800/50 p-3 rounded-xl">
                {viewing.message}
              </p>
            </div>
            <p className="text-xs text-text-muted">
              {new Date(viewing.createdAt).toLocaleString()}
            </p>
            <a
              href={`mailto:${viewing.email}?subject=Re: ${viewing.subject}`}
              className="btn-primary w-full justify-center"
            >
              <Mail size={14} />
              Reply via Email
            </a>
          </div>
        )}
      </Modal>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Message"
        message="Permanently delete this message?"
        loading={deleting}
      />
    </div>
  );
}
