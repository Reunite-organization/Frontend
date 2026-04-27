import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  ChevronDown,
  Globe,
  Heart,
  Inbox,
  LogOut,
  Menu,
  MessageCircle,
  Shield,
  User,
  Users,
  X,
} from "lucide-react";
import { useLanguage } from "../../lib/i18n";
import { useAuth } from "../../hooks/useAuth";
import { wantedApi } from "../../features/wanted/services/wantedApi";
import { TrustBadge } from "../../features/wanted/components/profile/TrustBadge";
import { isAdminRole } from "../../lib/authRoles";

const primaryLinks = [
  { path: "/cases", label: { en: "Cases", am: "ኬሶች" } },
  { path: "/report", label: { en: "Report Missing", am: "ጠፋ ሪፖርት" } },
  { path: "/volunteers", label: { en: "Volunteer Response", am: "በጎ ፈቃድ" } },
  { path: "/admin", label: { en: "Command Center", am: "ቁጥጥር ማዕከል" } },
  { path: "/ai", label: { en: "AI Desk", am: "AI ማዕከል" }, icon: Bot },
];

const reconnectLinks = [
  {
    path: "/wanted",
    label: { en: "Reconnect Hub", am: "የእንደገና መገናኛ ማዕከል" },
    description: {
      en: "Browse reconnect posts",
      am: "የመገናኛ ፖስቶችን ይመልከቱ",
    },
  },
  {
    path: "/wanted/create",
    label: { en: "Share Memory Post", am: "የትዝታ ፖስት ያጋሩ" },
    description: {
      en: "Create a reconnect memory post",
      am: "የትዝታ መገናኛ ፖስት ፍጠሩ",
    },
  },
  {
    path: "/wanted/stories",
    label: { en: "Success Stories", am: "የስኬት ታሪኮች" },
    description: {
      en: "Read successful reconnect stories",
      am: "የተሳኩ መገናኛዎችን ያንብቡ",
    },
  },
  {
    path: "/wanted/stories/share",
    label: { en: "Share Success Story", am: "የስኬት ታሪክ አጋሩ" },
    description: {
      en: "Publish a completed reconnect story",
      am: "የተጠናቀቀ መገናኛ ታሪክ ያትሙ",
    },
  },
];

export const MainHeader = () => {
  const { language, setLanguage } = useLanguage();
  const { user, profile, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isReconnectMenuOpen, setIsReconnectMenuOpen] = useState(false);
  const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
  const canAccessAdmin = isAdminRole(user?.role);
  const visiblePrimaryLinks = primaryLinks.filter(
    (link) => link.path !== "/admin" || canAccessAdmin,
  );

  const isReconnectActive = useMemo(
    () => location.pathname.startsWith("/wanted"),
    [location.pathname],
  );

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !profile) {
      setPendingClaimsCount(0);
      return;
    }

    const loadClaims = async () => {
      try {
        const claims = await wantedApi.getPendingClaims();
        setPendingClaimsCount(claims?.length || 0);
      } catch (error) {
        setPendingClaimsCount(0);
      }
    };

    loadClaims();
    const interval = window.setInterval(loadClaims, 30000);
    return () => window.clearInterval(interval);
  }, [isAuthenticated, profile]);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const handleLogout = async () => {
    await logout();
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-stone-200 bg-white/95 shadow-sm backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between md:h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-hope-green ring-2 ring-white" />
              </div>
              <div>
                <div className="font-display text-xl font-bold text-charcoal md:text-2xl">
                  Reunite
                </div>
                <div className="hidden text-xs text-stone-500 md:block">
                  Missing-person response first
                </div>
              </div>
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              {visiblePrimaryLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive(link.path)
                      ? "bg-terracotta/10 text-terracotta"
                      : "text-stone-700 hover:bg-stone-100 hover:text-charcoal"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {link.icon ? <link.icon className="h-4 w-4" /> : null}
                    {language === "am" ? link.label.am : link.label.en}
                  </span>
                </Link>
              ))}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsReconnectMenuOpen((current) => !current)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    isReconnectActive
                      ? "bg-terracotta/10 text-terracotta"
                      : "text-stone-700 hover:bg-stone-100 hover:text-charcoal"
                  }`}
                >
                  <span>
                    {language === "am" ? "እንደገና መገናኘት" : "Reconnect"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {isReconnectMenuOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-3 w-80 rounded-3xl border border-stone-200 bg-white p-3 shadow-xl"
                    >
                      {reconnectLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setIsReconnectMenuOpen(false)}
                          className="block rounded-2xl px-4 py-3 transition hover:bg-stone-50"
                        >
                          <div className="font-medium text-charcoal">
                            {language === "am" ? link.label.am : link.label.en}
                          </div>
                          <div className="mt-1 text-xs leading-5 text-stone-500">
                            {language === "am"
                              ? link.description.am
                              : link.description.en}
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setIsLangMenuOpen((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-stone-600 transition hover:bg-stone-100 hover:text-charcoal"
                >
                  <Globe className="h-4 w-4" />
                  <span>{language === "am" ? "አማ" : "EN"}</span>
                </button>

                <AnimatePresence>
                  {isLangMenuOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-3 w-36 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl"
                    >
                      {[
                        { code: "en", label: "English" },
                        { code: "am", label: "አማርኛ" },
                      ].map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => {
                            setLanguage(item.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                            language === item.code
                              ? "bg-terracotta/10 text-terracotta"
                              : "text-stone-700 hover:bg-stone-50"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/wanted/claims"
                    className="relative rounded-full p-2 text-stone-600 transition hover:bg-stone-100 hover:text-charcoal"
                    aria-label="Claims"
                  >
                    <Inbox className="h-5 w-5" />
                    {pendingClaimsCount > 0 ? (
                      <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-terracotta px-1 text-[11px] font-semibold text-white">
                        {pendingClaimsCount > 9 ? "9+" : pendingClaimsCount}
                      </span>
                    ) : null}
                  </Link>

                  <Link
                    to="/wanted/chat"
                    className="rounded-full p-2 text-stone-600 transition hover:bg-stone-100 hover:text-charcoal"
                    aria-label="Reconnect chat"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Link>

                  <div className="relative hidden sm:block">
                    <button
                      type="button"
                      onClick={() => setIsProfileMenuOpen((current) => !current)}
                      className="inline-flex items-center gap-2 rounded-full p-1.5 transition hover:bg-stone-100"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-terracotta to-sahara text-sm font-semibold text-white">
                        {profile?.realName?.[0]?.toUpperCase() ||
                          user?.name?.[0]?.toUpperCase() ||
                          user?.email?.[0]?.toUpperCase() ||
                          "R"}
                      </div>
                      <ChevronDown className="h-4 w-4 text-stone-500" />
                    </button>

                    <AnimatePresence>
                      {isProfileMenuOpen ? (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute right-0 mt-3 w-72 rounded-3xl border border-stone-200 bg-white p-3 shadow-xl"
                        >
                          <div className="rounded-2xl bg-stone-50 p-4">
                            <p className="font-semibold text-charcoal">
                              {profile?.realName || user?.name || "Reunite user"}
                            </p>
                            <p className="mt-1 text-sm text-stone-500">
                              {user?.email || user?.phone || "Authenticated"}
                            </p>
                            {profile?.trustScore ? (
                              <div className="mt-3">
                                <TrustBadge score={profile.trustScore} size="sm" />
                              </div>
                            ) : null}
                          </div>

                          <div className="mt-3 space-y-1">
                            <Link
                              to="/wanted/profile"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-stone-700 transition hover:bg-stone-50"
                            >
                              <User className="h-4 w-4" />
                              Profile
                            </Link>
                            <Link
                              to="/volunteers"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-stone-700 transition hover:bg-stone-50"
                            >
                              <Users className="h-4 w-4" />
                              Volunteer response
                            </Link>
                            {canAccessAdmin ? (
                              <Link
                                to="/admin"
                                onClick={() => setIsProfileMenuOpen(false)}
                                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-stone-700 transition hover:bg-stone-50"
                              >
                                <Shield className="h-4 w-4" />
                                Command Center
                              </Link>
                            ) : null}
                            <button
                              type="button"
                              onClick={handleLogout}
                              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                            >
                              <LogOut className="h-4 w-4" />
                              Sign out
                            </button>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="hidden items-center gap-2 sm:flex">
                  <Link
                    to="/auth/login"
                    className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-charcoal"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/auth/register"
                    className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-clay"
                  >
                    Join Reunite
                  </Link>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                className="rounded-full p-2 text-charcoal transition hover:bg-stone-100 md:hidden"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-[20rem] overflow-y-auto bg-white px-5 py-6 shadow-2xl">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Missing-person operations
                </p>
                {visiblePrimaryLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive(link.path)
                        ? "bg-terracotta/10 text-terracotta"
                        : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {language === "am" ? link.label.am : link.label.en}
                  </Link>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Reconnect
                </p>
                {reconnectLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive(link.path)
                        ? "bg-terracotta/10 text-terracotta"
                        : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {language === "am" ? link.label.am : link.label.en}
                  </Link>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-stone-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-charcoal">
                    Language
                  </span>
                  <div className="flex gap-2">
                    {[
                      { code: "en", label: "EN" },
                      { code: "am", label: "አማ" },
                    ].map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => setLanguage(item.code)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          language === item.code
                            ? "bg-terracotta text-white"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {isAuthenticated ? (
                <div className="mt-6 space-y-2">
                  <Link
                    to="/wanted/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await handleLogout();
                    }}
                    className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-2">
                  <Link
                    to="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-2xl border border-stone-200 px-4 py-3 text-center text-sm font-medium text-stone-700"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-2xl bg-terracotta px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Join Reunite
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="h-16 md:h-20" />
    </>
  );
};
