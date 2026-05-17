import { useResetPasswordMutation } from "@/store/api/auth.api";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [show, setShow] = useState({ password: false, confirm: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.password || !form.confirm)
      return toast.error("All fields required");
    if (form.password !== form.confirm)
      return toast.error("Passwords do not match");
    if (!token) return toast.error("Invalid or expired reset link");
    try {
      await resetPassword({ token, newPassword: form.password }).unwrap();
      toast.success("Password reset! Please login.");
      navigate("/login");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Reset failed";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main-dark flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary shadow-lg shadow-primary/30 mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-slate-400 text-sm mt-1">
            Enter your new password below
          </p>
        </div>
        <div className="bg-surface-dark rounded-2xl border border-border-dark p-8 shadow-2xl">
          {!token ? (
            <div className="text-center py-4">
              <p className="text-danger mb-4">
                Invalid or missing reset token.
              </p>
              <Link
                to="/forgot-password"
                className="btn-primary justify-center w-full"
              >
                Request New Link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {(["password", "confirm"] as const).map((field) => (
                <div key={field}>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {field === "password" ? "New Password" : "Confirm Password"}
                  </label>
                  <div className="relative mt-1.5">
                    <Lock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type={show[field] ? "text" : "password"}
                      value={form[field]}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field]: e.target.value }))
                      }
                      placeholder="••••••••"
                      className="dash-input pl-9 pr-10 bg-slate-800/60 border-border-dark text-white placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShow((s) => ({ ...s, [field]: !s[field] }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {show[field] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full justify-center py-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-slate-400 hover:text-white text-sm mt-5 transition-colors"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
