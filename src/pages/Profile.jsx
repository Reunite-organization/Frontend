import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, LogOut, ShieldCheck, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/auth");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    async function loadProfile() {
      try {
        const response = await fetch("/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:from-black dark:via-orange-950/20 dark:to-black dark:bg-gradient-to-b flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-stone-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:from-black dark:via-orange-950/20 dark:to-black dark:bg-gradient-to-b py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
              <p className="text-sm text-slate-500 mt-2">
                Review your account details and manage your session.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-slate-200 p-6 bg-emerald-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Account</p>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {user?.name || "Unknown"}
                  </h2>
                </div>
              </div>
              <div className="space-y-3 text-sm text-slate-700">
                <div>
                  <p className="text-slate-500">Device ID</p>
                  <p className="font-medium break-all">
                    {user?.deviceId || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Role</p>
                  <p className="font-medium">{user?.role || "REPORTER"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 p-6 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Profile Details</p>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Verified
                  </h2>
                </div>
              </div>
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{user?.email || "No email linked"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{user?.phone || "No phone linked"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-sm text-slate-500">
            <p>
              To keep your account secure, sign out when you finish using this
              device. If you need to update your details, please use the support
              channel below.
            </p>
            <p className="mt-4">
              Need help?{" "}
              <Link to="/auth" className="text-emerald-600 hover:underline">
                Sign in again
              </Link>{" "}
              or contact support.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
