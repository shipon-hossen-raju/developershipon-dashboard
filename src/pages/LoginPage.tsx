import { useLoginMutation } from "@/store/api/auth.api";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux";
import { setCredentials } from "../store/slices/authSlice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const res = await login(form).unwrap();
      console.log("res login ", res);
      if (res.success) {
        // if (true) {
        dispatch(
          setCredentials({ user: res.data.user, token: res.data.token }),
        );
        // dispatch(
        //   setCredentials({
        //     user: {
        //       _id: "1",
        //       name: "John Doe",
        //       email: "admin@example.com",
        //       role: "admin",
        //       avatar: "",
        //     },
        //     token: "token",
        //   }),
        // );
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch {
      toast.error("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-bg-main-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary shadow-lg shadow-primary/30 mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Portfolio Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-dark rounded-2xl border border-border-dark p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="dash-input bg-slate-800/60 border-border-dark text-white placeholder-slate-500"
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="dash-input bg-slate-800/60 border-border-dark text-white placeholder-slate-500 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-3 text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Portfolio dashboard — restricted access only
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          <a
            href="https://developershipon.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-400 transition-colors"
          >
            ← Back to portfolio
          </a>
        </p>
      </div>
    </div>
  );
}
