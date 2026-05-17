import { Eye, Trash2, UserCheck } from "lucide-react";
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
  useDeleteHireRequestMutation,
  useGetHireRequestsQuery,
  useUpdateHireStatusMutation,
} from "../store/api/endpoints";
import type { HireRequest } from "../types";

const statusOpts: {
  value: HireRequest["status"];
  label: string;
  variant: "gray" | "blue" | "green" | "red";
}[] = [
  { value: "pending", label: "Pending", variant: "gray" },
  { value: "reviewed", label: "Reviewed", variant: "blue" },
  { value: "accepted", label: "Accepted", variant: "green" },
  { value: "rejected", label: "Rejected", variant: "red" },
];

export default function HireRequestsPage() {
  const { data, isLoading } = useGetHireRequestsQuery();
  const [updateStatus] = useUpdateHireStatusMutation();
  const [remove, { isLoading: deleting }] = useDeleteHireRequestMutation();

  const items = data?.data ?? [];
  const [viewing, setViewing] = useState<HireRequest | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleStatus = async (id: string, status: HireRequest["status"]) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Status → ${status}`);
    } catch {
      toast.error("Failed to update");
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

  const pending = items.filter((h) => h.status === "pending").length;

  const columns = [
    {
      key: "name",
      label: "Client",
      sortable: true,
      render: (row: unknown) => {
        const request = row as HireRequest;

        return (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
              {request.name[0].toUpperCase()}
            </div>

            <div>
              <p className="font-semibold text-text-main dark:text-text-main-dark text-sm line-clamp-1">
                {request.name}
              </p>

              <p className="text-xs text-text-muted line-clamp-1">
                {request.email}
              </p>
            </div>
          </div>
        );
      },
    },

    {
      key: "service",
      label: "Service",
      sortable: true,
      render: (row: unknown) => {
        const request = row as HireRequest;

        return (
          <p className="text-sm font-medium text-text-main dark:text-text-main-dark line-clamp-1">
            {request.service}
          </p>
        );
      },
    },

    {
      key: "phoneNumber",
      label: "Phone",
      render: (row: unknown) => {
        const request = row as HireRequest;

        return (
          <span className="text-xs text-text-muted">{request.phoneNumber}</span>
        );
      },
    },

    {
      key: "status",
      label: "Status",
      render: (row: unknown) => {
        const request = row as HireRequest;

        const s = statusOpts.find((o) => o.value === request.status);

        return (
          <select
            value={request.status}
            onChange={(e) =>
              handleStatus(request.id, e.target.value as HireRequest["status"])
            }
            className="text-xs font-semibold px-2 py-1 rounded-full border-0 outline-none cursor-pointer"
            style={{ background: "transparent" }}
          >
            {statusOpts.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );
      },
    },

    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (row: unknown) => {
        const request = row as HireRequest;

        return (
          <span className="text-xs text-text-muted">
            {new Date(request.createdAt).toLocaleDateString("en-US", {
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
        const request = row as HireRequest;

        return (
          <div className="flex gap-1">
            <button
              onClick={() => setViewing(request)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <Eye size={13} />
            </button>

            <button
              onClick={() => setDeleteId(request.id)}
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
        title="Hire Requests"
        desc={`${items.length} total · ${pending} pending`}
      />
      <DataTable
        columns={columns}
        data={items as unknown as Record<string, unknown>[]}
        keyField="id"
        searchable
        searchPlaceholder="Search requests..."
        searchKeys={["name", "email", "service"]}
        emptyState={
          <EmptyState
            icon={<UserCheck size={22} />}
            title="No hire requests"
            desc="Service hire enquiries will appear here"
          />
        }
      />

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title="Hire Request Details"
        size="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              {viewing &&
                statusOpts.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => {
                      handleStatus(viewing.id, s.value);
                      setViewing({ ...viewing, status: s.value });
                    }}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${viewing.status === s.value ? "bg-primary text-white" : "bg-bg-main dark:bg-slate-800 text-text-muted hover:text-text-main dark:hover:text-text-main-dark"}`}
                  >
                    {s.label}
                  </button>
                ))}
            </div>
            <button onClick={() => setViewing(null)} className="btn-secondary">
              Close
            </button>
          </div>
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
                  {viewing.email} · {viewing.phoneNumber}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-bg-main dark:bg-slate-800/50">
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide mb-1">
                  Service
                </p>
                <p className="text-sm font-semibold text-text-main dark:text-text-main-dark">
                  {viewing.service}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-bg-main dark:bg-slate-800/50">
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide mb-1">
                  Status
                </p>
                <Badge
                  label={viewing.status}
                  variant={
                    statusOpts.find((s) => s.value === viewing.status)
                      ?.variant ?? "gray"
                  }
                  dot
                />
              </div>
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
              href={`mailto:${viewing.email}?subject=Re: Your Hire Request - ${viewing.service}`}
              className="btn-primary w-full justify-center"
            >
              Reply via Email
            </a>
          </div>
        )}
      </Modal>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Request"
        message="Permanently delete this hire request?"
        loading={deleting}
      />
    </div>
  );
}
