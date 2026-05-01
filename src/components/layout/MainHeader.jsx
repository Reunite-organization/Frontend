import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import reuniteImg from "../../assets/reunite.png";
import {
  Bot,
  ChevronDown,
  Globe,
  Heart,
  Inbox,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Shield,
  Settings,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import { useLanguage } from "../../lib/i18n";
import { useAuth } from "../../hooks/useAuth";
import { wantedApi } from "../../features/wanted/services/wantedApi";
import { TrustBadge } from "../../features/wanted/components/profile/TrustBadge";
import { isAdminRole } from "../../lib/authRoles";
import { useTheme } from "../../app/providers/ThemeProvider";

const primaryLinks = [
  { path: "/cases", label: { en: "Cases", am: "ኬዞች" } },
  { path: "/report", label: { en: "Report Missing", am: "የጠፉ ሰዎችን ያመልክቱ" } },
  {
    path: "/volunteers",
    label: { en: "Volunteer Response", am: "የበጎ ፈቃደኞች ምላሽ" },
  },
  { path: "/admin", label: { en: "Command Center", am: "Command Center" } },
];

const reconnectLinks = [
  {
    path: "/wanted",
    label: { en: "Reconnect Hub", am: "የተራራቁ ሰዎች መገንናኛ ማዕከል" },
    description: {
      en: "Browse reconnect posts",
      am: "የተለጠፉ ትዝታዎችን ይመልከቱ",
    },
  },
  {
    path: "/wanted/create",
    label: { en: "Share Memory Post", am: "የተለጠፉ ትዝታዎትን ያጋሩ" },
    description: {
      en: "Create a reconnect memory post",
      am: "የእርሶን ትዝታ የጋሩ",
    },
  },
  {
    path: "/wanted/stories",
    label: { en: "Success Stories", am: "የተሳኩ ታሪኮች" },
    description: {
      en: "Read successful reconnect stories",
      am: "የተሳኩ ታሪኮችን ያንብቡ",
    },
  },
  {
    path: "/wanted/stories/share",
    label: { en: "Share Success Story", am: "የተሳኩ ታሪኮችን ያጋሩ" },
    description: {
      en: "Publish a completed reconnect story",
      am: "የተሳኩሎትን ታሮኮች ለሌሎች ያጋሩ",
    },
  },
];

export const MainHeader = () => {
  const { language, setLanguage } = useLanguage();
  const { user, profile, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isReconnectMenuOpen, setIsReconnectMenuOpen] = useState(false);
  const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
  const canAccessAdmin = isAdminRole(user?.role);
  const reconnectMenuRef = useRef(null);
  const langMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const visiblePrimaryLinks = primaryLinks.filter(
    (link) => link.path !== "/admin" || canAccessAdmin,
  );

  const isLandingPage = location.pathname === '/';

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        reconnectMenuRef.current &&
        !reconnectMenuRef.current.contains(event.target)
      ) {
        setIsReconnectMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        className={`absolute left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-stone-200 shadow-sm backdrop-blur-lg bg-white/80"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto  max-w-7.5xl px-4 sm:px-6 lg:px-8 mb-5">
          <div className="flex h-16 items-center justify-between md:h-20">
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="relative">
                <img src={reuniteImg} alt="Reunite" width={40} className="md:w-[50px]" />
              </div>
              <div>
                <div className={`font-display text-lg md:text-xl lg:text-2xl font-bold ${
                  isLandingPage && !isScrolled ? 'text-white' : 'text-charcoal'
                }`}>
                  Reunite
                </div>
              </div>
            </Link>

            <div className="hidden items-center gap-2 xl:flex">
              {visiblePrimaryLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`rounded-full px-4 py-2 text-md font-medium transition ${
                    isActive(link.path)
                      ? "bg-terracotta/10 text-terracotta"
                      : isLandingPage && !isScrolled
                        ? "bg-transparent text-white border-transparent hover:bg-white/10"
                        : "text-stone-700 hover:bg-stone-100 hover:text-charcoal"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {link.icon ? <link.icon className="h-4 w-4" /> : null}
                    {language === "am" ? link.label.am : link.label.en}
                  </span>
                </Link>
              ))}

              <div className="relative" ref={reconnectMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsReconnectMenuOpen((current) => !current)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-md font-medium transition ${
                    isReconnectActive
                      ? "bg-terracotta/10 text-terracotta"
                      : isLandingPage && !isScrolled
                        ? "bg-transparent text-white border-transparent hover:bg-white/10"
                        : "text-stone-700 hover:bg-stone-100 hover:text-charcoal"
                  }`}
                >
                  <span>
                    {language === "am" ? "እንደገና ለመገናኘት" : "Reconnect"}
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
                        </Link>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <Link
                to="/ai"
                className={`rounded-full px-4 py-2 text-md font-medium transition inline-flex items-center gap-2 ${
                  isActive("/ai")
                    ? "bg-terracotta/10 text-terracotta"
                    : isLandingPage && !isScrolled
                      ? "bg-transparent text-white border-transparent hover:bg-white/10"
                      : "text-stone-700 hover:bg-stone-100 hover:text-charcoal"
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>{language === "am" ? "እርዳታ" : "Help"}</span>
              </Link>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border transition ${
                  isLandingPage && !isScrolled
                    ? "border-white/30 bg-white/10 text-white hover:bg-white/20"
                    : "border-stone-200 bg-white/80 text-stone-700 hover:border-terracotta/30 hover:text-terracotta"
                }`}
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>

              <div className="relative" ref={langMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsLangMenuOpen((current) => !current)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm transition ${
                    isLandingPage && !isScrolled
                      ? "text-white hover:bg-white/10"
                      : "text-stone-600 hover:bg-stone-100 hover:text-charcoal"
                  }`}
                >
                  <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{language === "am" ? "አማ" : "EN"}</span>
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
                    className={`relative rounded-full p-1.5 sm:p-2 transition  xs:block ${
                      isLandingPage && !isScrolled
                        ? "text-white hover:bg-white/10"
                        : "text-stone-600 hover:bg-stone-100 hover:text-charcoal"
                    }`}
                    aria-label="Claims"
                  >
                    <Inbox className="h-4 w-4 sm:h-5 sm:w-5" />
                    {pendingClaimsCount > 0 ? (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 sm:h-5 min-w-[1rem] sm:min-w-[1.25rem] items-center justify-center rounded-full bg-terracotta px-1 text-[10px] sm:text-[11px] font-semibold text-white">
                        {pendingClaimsCount > 9 ? "9+" : pendingClaimsCount}
                      </span>
                    ) : null}
                  </Link>

                  <Link
                    to="/wanted/chat"
                    className={`rounded-full p-1.5 sm:p-2 transition hidden xs:block ${
                      isLandingPage && !isScrolled
                        ? "text-white hover:bg-white/10"
                        : "text-stone-600 hover:bg-stone-100 hover:text-charcoal"
                    }`}
                    aria-label="Reconnect chat"
                  >
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>

                  <div className="relative" ref={profileMenuRef}>
                    <button
                      type="button"
                      onClick={() =>
                        setIsProfileMenuOpen((current) => !current)
                      }
                      className={`inline-flex items-center gap-1.5 rounded-full p-1 sm:p-1.5 transition ${
                        isLandingPage && !isScrolled
                          ? "hover:bg-white/10"
                          : "hover:bg-stone-100"
                      }`}
                    >
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-terracotta to-sahara text-xs sm:text-sm font-semibold text-white">
                        {profile?.avatarUrl ? (
                          <img
                            src={profile.avatarUrl}
                            alt={profile?.realName || user?.name || "Profile"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          profile?.realName?.[0]?.toUpperCase() ||
                          user?.name?.[0]?.toUpperCase() ||
                          user?.email?.[0]?.toUpperCase() ||
                          "R"
                        )}
                      </div>
                      <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 hidden sm:block ${
                        isLandingPage && !isScrolled ? "text-white" : "text-stone-500"
                      }`} />
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
                              {profile?.realName ||
                                user?.name ||
                                "Reunite user"}
                            </p>
                            <p className="mt-1 text-sm text-stone-500">
                              {user?.email || user?.phone || "Authenticated"}
                            </p>
                            {profile?.trustScore ? (
                              <div className="mt-3">
                                <TrustBadge
                                  score={profile.trustScore}
                                  size="sm"
                                />
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

                            <Link
                              to="/settings"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-stone-700 transition hover:bg-stone-50"
                            >
                              <Settings className="h-4 w-4" />
                              Settings
                            </Link>
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
                <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                  <Link
                    to="/auth/login"
                    className={`rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium transition whitespace-nowrap ${
                      isLandingPage && !isScrolled
                        ? "text-white hover:bg-white/10"
                        : "text-stone-700 hover:bg-stone-100 hover:text-charcoal"
                    }`}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/auth/register"
                    className={`rounded-full px-3 sm:px-5 py-1.5 sm:py-2.5 text-sm font-semibold transition whitespace-nowrap ${
                      isLandingPage && !isScrolled
                        ? "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                        : "bg-terracotta text-white hover:bg-clay"
                    }`}
                  >
                    Join Reunite
                  </Link>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                className={`rounded-full p-1.5 sm:p-2 transition xl:hidden ${
                  isLandingPage && !isScrolled
                    ? "text-white hover:bg-white/10"
                    : "text-charcoal hover:bg-stone-100"
                }`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
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
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 xl:hidden"
          >
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-full max-w-[18rem] sm:max-w-[20rem] overflow-y-auto bg-white px-5 py-12 shadow-2xl">
              <div className="space-y-1">
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
                <Link
                  to="/ai"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block rounded-2xl px-4 py-3 text-sm font-medium transition flex items-center gap-3 ${
                    isActive("/ai")
                      ? "bg-terracotta/10 text-terracotta"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <Bot className="h-4 w-4" />
                  <span>{language === "am" ? "እርዳታ" : "Help"}</span>
                </Link>
              </div>

              <div className="mt-6 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 px-1">
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

              <div className="mt-6 rounded-2xl border border-stone-200 p-4">
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
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          language === item.code
                            ? "bg-terracotta text-white"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
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
                  <div className="rounded-2xl bg-stone-50 p-4 mb-4">
                    <p className="font-semibold text-charcoal text-sm">
                      {profile?.realName || user?.name || "Reunite user"}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      {user?.email || user?.phone || "Authenticated"}
                    </p>
                    {profile?.trustScore ? (
                      <div className="mt-2">
                        <TrustBadge score={profile.trustScore} size="sm" />
                      </div>
                    ) : null}
                  </div>

                  <Link
                    to="/wanted/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    to="/wanted/claims"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                  >
                    <Inbox className="h-4 w-4" />
                    Claims
                    {pendingClaimsCount > 0 ? (
                      <span className="ml-auto rounded-full bg-terracotta px-2 py-0.5 text-xs font-semibold text-white">
                        {pendingClaimsCount}
                      </span>
                    ) : null}
                  </Link>
                  <Link
                    to="/wanted/chat"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat
                  </Link>

                  {canAccessAdmin ? (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                    >
                      <Shield className="h-4 w-4" />
                      Command Center
                    </Link>
                  ) : null}

                  <Link
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>

                  <button
                    type="button"
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await handleLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 mt-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  <Link
                    to="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-2xl border border-stone-200 px-4 py-3 text-center text-sm font-medium text-stone-700 hover:bg-stone-50 transition"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-2xl bg-terracotta px-4 py-3 text-center text-sm font-semibold text-white hover:bg-clay transition"
                  >
                    Join Reunite
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};
