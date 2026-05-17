import { useState, useRef } from "react";
import { User, Lock, Camera, Save, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { setCredentials } from "../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { PageHeader, Skeleton } from "../components/ui";
import {
  useChangePasswordMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
} from "@/store/api/auth.api";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { data, isLoading } = useGetMeQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: changingPwd }] =
    useChangePasswordMutation();

  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [name, setName] = useState(user?.name ?? "");

  const [pwd, setPwd] = useState({ current: "", newPwd: "", confirm: "" });
  const [showPwd, setShowPwd] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleProfileSave = async () => {
    if (!name.trim()) return toast.error("Name is required");
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await updateProfile(formData).unwrap();
      if (res.success && user) {
        dispatch(
          setCredentials({
            user: {
              ...user,
              name: res.data.name,
              avatar: res.data.avatar ?? user.avatar,
            },
            accessToken: localStorage.getItem("dash-token") ?? "",
          }),
        );
        toast.success("Profile updated!");
        setAvatarFile(null);
      }
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = async () => {
    if (!pwd.current || !pwd.newPwd || !pwd.confirm)
      return toast.error("All password fields are required");
    if (pwd.newPwd !== pwd.confirm)
      return toast.error("New passwords do not match");
    if (pwd.newPwd.length < 8)
      return toast.error("New password must be at least 8 characters");
    try {
      await changePassword({
        currentPassword: pwd.current,
        newPassword: pwd.newPwd,
      }).unwrap();
      toast.success("Password changed! Please login again.");
      setPwd({ current: "", newPwd: "", confirm: "" });
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to change password";
      toast.error(msg);
    }
  };

  const profileData = data?.data;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Profile"
        desc="Manage your account information and password"
      />

      {/* ── Profile Card ── */}
      <div className="dash-card space-y-6">
        <h3 className="text-sm font-bold text-text-main dark:text-text-main-dark flex items-center gap-2">
          <User size={16} className="text-primary" /> Personal Information
        </h3>

        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-primary/20 flex items-center justify-center">
              {avatarPreview || profileData?.avatar ? (
                <img
                  src={avatarPreview ?? profileData?.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-primary font-bold text-2xl">
                  {(name || user?.name || "S")[0].toUpperCase()}
                </span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <Camera size={18} className="text-white" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-main dark:text-text-main-dark">
              Profile Photo
            </p>
            <p className="text-xs text-text-muted dark:text-text-muted-dark mt-0.5">
              JPG, PNG or WebP. Max 2MB.
            </p>
            <button
              onClick={() => fileRef.current?.click()}
              className="text-xs text-primary hover:underline mt-1 font-medium"
            >
              Change photo
            </button>
          </div>
        </div>

        {/* Name & Email */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
              Full Name
            </label>
            {isLoading ? (
              <Skeleton className="h-10 mt-1.5" />
            ) : (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="dash-input mt-1.5"
                placeholder="Your full name"
              />
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
              Email Address
            </label>
            <input
              value={profileData?.email ?? user?.email ?? ""}
              readOnly
              className="dash-input mt-1.5 opacity-60 cursor-not-allowed"
            />
            <p className="text-xs text-text-muted dark:text-text-muted-dark mt-1">
              Email cannot be changed.
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
              Role
            </label>
            <input
              value={user?.role ?? "ADMIN"}
              readOnly
              className="dash-input mt-1.5 opacity-60 cursor-not-allowed capitalize"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleProfileSave}
            disabled={updating}
            className="btn-primary"
          >
            {updating ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={15} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Change Password ── */}
      <div className="dash-card space-y-5">
        <h3 className="text-sm font-bold text-text-main dark:text-text-main-dark flex items-center gap-2">
          <Lock size={16} className="text-primary" /> Change Password
        </h3>

        {(["current", "newPwd", "confirm"] as const).map((field) => {
          const labels = {
            current: "Current Password",
            newPwd: "New Password",
            confirm: "Confirm New Password",
          };
          const keys = {
            current: "current",
            newPwd: "new",
            confirm: "confirm",
          } as const;
          return (
            <div key={field}>
              <label className="text-xs font-semibold text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
                {labels[field]}
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showPwd[keys[field]] ? "text" : "password"}
                  value={pwd[field]}
                  onChange={(e) =>
                    setPwd((p) => ({ ...p, [field]: e.target.value }))
                  }
                  className="dash-input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPwd((s) => ({
                      ...s,
                      [keys[field]]: !s[keys[field]],
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main dark:hover:text-text-main-dark"
                >
                  {showPwd[keys[field]] ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>
              </div>
            </div>
          );
        })}

        <div className="bg-bg-main dark:bg-slate-800/50 rounded-xl p-3 text-xs text-text-muted dark:text-text-muted-dark space-y-1">
          <p className="font-semibold text-text-main dark:text-text-main-dark mb-1">
            Password requirements:
          </p>
          {[
            "At least 8 characters",
            "One uppercase letter",
            "One number",
            "One special character",
          ].map((r) => (
            <p key={r} className="flex items-center gap-1.5">
              <span className="text-primary">✓</span>
              {r}
            </p>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handlePasswordChange}
            disabled={changingPwd}
            className="btn-primary"
          >
            {changingPwd ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Changing...
              </>
            ) : (
              <>
                <Lock size={15} /> Change Password
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
