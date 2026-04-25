"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CASES } from "../lib/site-data";
import { PlusIcon } from "./icons";

const SiteShellContext = createContext(null);

export function useSiteShell() {
  const value = useContext(SiteShellContext);
  if (!value) {
    throw new Error("useSiteShell must be used within SiteShellProvider");
  }
  return value;
}

function AlertBanner() {
  return (
    <div className="alert-banner">
      <span className="alert-banner__pulse" />
      <strong>CRITICAL CASE:</strong> Selam Bekele — missing 3 days in Mercato, Addis Ababa.
      <Link href="/cases/1">View case →</Link>
    </div>
  );
}

function Nav() {
  const pathname = usePathname() || "";
  const { loggedIn } = useSiteShell();

  const activePage = useMemo(() => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/cases")) return "cases";
    if (pathname.startsWith("/map")) return "map";
    if (pathname.startsWith("/memories") || pathname.startsWith("/create-memory")) return "memories";
    if (pathname.startsWith("/admin")) return "admin";
    return "";
  }, [pathname]);

  return (
    <nav className="nav">
      <div className="nav__inner">
        <Link className="logo" href="/">
          REUNITE <span className="logo__dot" />
        </Link>
        <div className="nav__links">
          {[
            ["home", "Home", "/"],
            ["cases", "Missing Persons", "/cases"],
            ["map", "Live Map", "/map"],
            ["memories", "Reconnect", "/memories"],
            ...(loggedIn ? [["admin", "Admin", "/admin"]] : []),
          ].map(([p, label, href]) => (
            <Link
              key={p}
              className={`nav__link ${activePage === p || (p === "cases" && pathname.startsWith("/cases")) ? "nav__link--active" : ""}`}
              href={href}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="nav__actions">
          <Link className="btn btn-sm btn-orange" href="/report">
            <PlusIcon /> Report Missing
          </Link>
          {loggedIn ? (
            <Link className="btn btn-sm btn-ghost" href="/profile">
              My Profile
            </Link>
          ) : (
            <Link className="btn btn-sm btn-ghost" href="/login">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function SightingModal({ onClose, onSubmit }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    setSubmitted(true);
    setTimeout(() => {
      onSubmit();
      onClose();
    }, 2000);
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <button className="modal__close" onClick={onClose}>
          ×
        </button>
        {submitted ? (
          <div className="success-box" style={{ padding: "32px 0 0" }}>
            <div className="success-icon">✓</div>
            <div className="success-title">Sighting submitted</div>
            <div className="success-sub" style={{ fontSize: 15 }}>
              Our team has been notified. The family will be updated immediately. Thank you — you may have just made the difference.
            </div>
          </div>
        ) : (
          <>
            <div className="modal__title">Report a Sighting</div>
            <div className="modal__sub">
              You can stay anonymous. Even uncertain sightings help narrow the search area.
            </div>
            <div className="form-group">
              <label className="form-label">Which case? *</label>
              <select className="form-select">
                {CASES.filter((c) => c.status !== "found").map((c) => (
                  <option key={c.id}>
                    Case AA-{String(c.id).padStart(4, "0")} — {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Where did you see them? *</label>
              <input
                className="form-input"
                type="text"
                placeholder="Street, landmark, or area in Addis Ababa…"
              />
            </div>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Date</label>
                <input className="form-input" type="date" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Approximate time</label>
                <input className="form-input" type="time" />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 24 }}>
              <label className="form-label">What were they doing / wearing?</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: 80 }}
                placeholder="Any details, no matter how small…"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Your phone (optional — for follow-up only)
              </label>
              <input className="form-input" type="tel" placeholder="+251 9…" />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                className="btn btn-md btn-ghost"
                style={{ flex: 1 }}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="btn btn-md btn-navy"
                style={{ flex: 2 }}
                onClick={handleSubmit}
              >
                Submit Sighting ✓
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function SiteShellProvider({ children }) {
  const [showSighting, setShowSighting] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const pathname = usePathname() || "";
  const router = useRouter();

  useEffect(() => {
    const routesToPrefetch = [
      "/",
      "/cases",
      "/cases/1",
      "/map",
      "/report",
      "/memories",
      "/memories/1",
      "/create-memory",
      "/login",
      "/profile",
      "/admin",
      "/chat",
    ];

    routesToPrefetch.forEach((href) => {
      router.prefetch(href);
    });
  }, [router]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const value = useMemo(
    () => ({
      loggedIn,
      setLoggedIn,
      openSighting: () => setShowSighting(true),
      closeSighting: () => setShowSighting(false),
    }),
    [loggedIn],
  );

  return (
    <SiteShellContext.Provider value={value}>
      <div className="app-shell">
        <AlertBanner />
        <Nav />
        {children}
        {showSighting && (
          <SightingModal
            onClose={() => setShowSighting(false)}
            onSubmit={() => setShowSighting(false)}
          />
        )}
      </div>
    </SiteShellContext.Provider>
  );
}
