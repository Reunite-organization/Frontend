import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Globe,
  Moon,
  Shield,
  SlidersHorizontal,
  Sun,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../app/providers/ThemeProvider";
import { useLanguage } from "../lib/i18n";
import { useAuth } from "../hooks/useAuth";
import { useUpdateProfile, useWantedProfile } from "../features/wanted/hooks/useProfile";

const ToggleRow = ({ title, description, value, onChange, disabled }) => (
  <div className="flex items-start justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5">
    <div>
      <p className="text-sm font-semibold text-charcoal">{title}</p>
      {description ? (
        <p className="mt-1 text-sm text-stone-500">{description}</p>
      ) : null}
    </div>
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!value)}
      className={`relative h-7 w-12 rounded-full transition disabled:opacity-60 ${
        value ? "bg-terracotta" : "bg-stone-200"
      }`}
      aria-label={title}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
          value ? "left-6" : "left-0.5"
        }`}
      />
    </button>
  </div>
);

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { data: wantedProfile } = useWantedProfile();
  const { mutate: updateWantedProfile, isPending: savingProfile } =
    useUpdateProfile();

  const [requestingNotifications, setRequestingNotifications] = useState(false);

  const notificationPermission = useMemo(() => {
    if (typeof Notification === "undefined") return "unsupported";
    return Notification.permission;
  }, [typeof Notification === "undefined" ? "no" : Notification.permission]);

  const allowNotifications = Boolean(
    wantedProfile?.privacySettings?.allowNotifications,
  );
  const showInSearch = Boolean(wantedProfile?.privacySettings?.showInSearch);

  const handleRequestNotifications = async () => {
    if (typeof Notification === "undefined") {
      toast.error("Notifications are not supported on this device/browser.");
      return;
    }

    setRequestingNotifications(true);
    try {
      const result = await Notification.requestPermission();
      if (result === "granted") toast.success("Notifications enabled.");
      else toast.warning("Notifications permission not granted.");
    } catch (error) {
      toast.error("Unable to request notifications permission.");
    } finally {
      setRequestingNotifications(false);
    }
  };

  const handleUpdatePrivacy = (next) => {
    if (!wantedProfile) {
      toast.error("Create your profile first to edit these settings.");
      return;
    }

    updateWantedProfile({
      privacySettings: {
        ...(wantedProfile.privacySettings || {}),
        ...next,
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:from-black dark:via-orange-950/20 dark:to-black dark:bg-gradient-to-b px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/30 p-8">
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Sign in to manage settings.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/auth/login"
              className="rounded-full bg-charcoal px-4 py-2 text-sm font-semibold text-white"
            >
              Sign in
            </Link>
            <Link
              to="/"
              className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700"
            >
              Back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:from-black dark:via-orange-950/20 dark:to-black dark:bg-gradient-to-b">
      <section className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-black/50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-terracotta">
                Settings
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-charcoal">
                Customize your experience
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500">
                Appearance, language, notifications, privacy, and account options
                for real-world operations.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/wanted/profile"
                className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link
                to="/volunteers"
                className="inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-white transition hover:bg-charcoal/90"
              >
                <Shield className="h-4 w-4" />
                Volunteer response
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-terracotta" />
              <h2 className="text-lg font-semibold text-charcoal">
                Appearance
              </h2>
            </div>
            <div className="rounded-3xl border border-stone-200 bg-white p-6">
              <p className="text-sm font-semibold text-charcoal">Theme</p>
              <p className="mt-1 text-sm text-stone-500">
                Choose light or dark mode.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    theme === "light"
                      ? "border-terracotta bg-terracotta/10 text-terracotta"
                      : "border-stone-200 text-stone-700 hover:border-terracotta/30 hover:text-terracotta"
                  }`}
                >
                  <Sun className="h-4 w-4" />
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    theme === "dark"
                      ? "border-terracotta bg-terracotta/10 text-terracotta"
                      : "border-stone-200 text-stone-700 hover:border-terracotta/30 hover:text-terracotta"
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-terracotta" />
              <h2 className="text-lg font-semibold text-charcoal">Language</h2>
            </div>
            <div className="rounded-3xl border border-stone-200 bg-white p-6">
              <p className="text-sm font-semibold text-charcoal">App language</p>
              <p className="mt-1 text-sm text-stone-500">
                Switch the interface language.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  { code: "en", label: "English" },
                  { code: "am", label: "አማርኛ" },
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLanguage(item.code)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      language === item.code
                        ? "border-terracotta bg-terracotta/10 text-terracotta"
                        : "border-stone-200 text-stone-700 hover:border-terracotta/30 hover:text-terracotta"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-terracotta" />
              <h2 className="text-lg font-semibold text-charcoal">
                Notifications
              </h2>
            </div>
            <div className="rounded-3xl border border-stone-200 bg-white p-6">
              <p className="text-sm font-semibold text-charcoal">
                Browser permission
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Permission status:{" "}
                <span className="font-semibold text-charcoal">
                  {notificationPermission}
                </span>
              </p>
              <button
                type="button"
                onClick={handleRequestNotifications}
                disabled={requestingNotifications}
                className="mt-4 rounded-full bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-charcoal/90 disabled:opacity-60"
              >
                {requestingNotifications ? "Requesting..." : "Request permission"}
              </button>
              <p className="mt-3 text-xs text-stone-500">
                Used for nearby-case alerts and operational updates.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-terracotta" />
              <h2 className="text-lg font-semibold text-charcoal">Privacy</h2>
            </div>
            {!wantedProfile ? (
              <div className="rounded-3xl border border-stone-200 bg-white p-6">
                <p className="text-sm text-stone-600">
                  Create your Reconnect profile to customize privacy settings.
                </p>
                <Link
                  to="/wanted/profile/create"
                  className="mt-4 inline-flex rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Create profile
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <ToggleRow
                  title="Show my profile in search"
                  description="Helps coordinators and volunteers find and verify you."
                  value={showInSearch}
                  onChange={(value) => handleUpdatePrivacy({ showInSearch: value })}
                  disabled={savingProfile}
                />
                <ToggleRow
                  title="Allow operational notifications"
                  description="Lets the system send you in-app alerts when relevant."
                  value={allowNotifications}
                  onChange={(value) =>
                    handleUpdatePrivacy({ allowNotifications: value })
                  }
                  disabled={savingProfile}
                />
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-charcoal">Account</h2>
          <p className="mt-1 text-sm text-stone-500">
            Signed in as{" "}
            <span className="font-semibold text-charcoal">
              {user?.email || user?.phone || user?.name || "user"}
            </span>
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/wanted/profile"
              className="rounded-full border border-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
            >
              Manage profile
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

