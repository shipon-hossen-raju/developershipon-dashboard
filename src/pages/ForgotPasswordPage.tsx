import { useForgotPasswordMutation } from "@/store/api/auth.api";
import { ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");
    try {
      await forgotPassword({ email }).unwrap();
      setSent(true);
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to send reset email";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main-dark flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary shadow-lg shadow-primary/30 mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
          <p className="text-slate-400 text-sm mt-1">
            Enter your email to receive a reset link
          </p>
        </div>

        <div className="bg-surface-dark rounded-2xl border border-border-dark p-8 shadow-2xl">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle size={48} className="text-primary mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">
                Check your email
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                We sent a password reset link to{" "}
                <span className="text-white font-medium">{email}</span>
              </p>
              <Link
                to="/login"
                className="btn-primary w-full justify-center py-3"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative mt-1.5">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    autoComplete="email"
                    className="dash-input pl-9 bg-slate-800/60 border-border-dark text-white placeholder-slate-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full justify-center py-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}

          {!sent && (
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-slate-400 hover:text-white text-sm mt-5 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
