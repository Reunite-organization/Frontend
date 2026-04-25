"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  EyeIcon,
  HeartIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  ShareIcon,
  SendIcon,
} from "./icons";
import { Badge, BackBtn, CaseCard, MemoryCard } from "./ui";
import { CASES, MEMORIES, initials } from "../lib/site-data";

export function HomePage({ navigate, openSighting }) {
  return (
    <div className="page fade-in">
      <div className="hero">
        <div className="hero__eyebrow">
          <span className="hero__eyebrow-dot" />
          Community-powered search network · Ethiopia
        </div>
        <h1 className="hero__title">
          Help us bring <em>families</em>
          <br />
          back together
        </h1>
        <p className="hero__subtitle">
          A platform for finding missing loved ones and reconnecting with
          people from your past — powered by community, maps, and AI.
        </p>
        <div className="hero__actions">
          <button className="btn btn-xl btn-navy" onClick={() => navigate("report")}>
            <SearchIcon /> Report Missing Person
          </button>
          <button className="btn btn-xl btn-ghost-orange" onClick={() => navigate("memories")}>
            <HeartIcon /> Find Someone I Miss
          </button>
          <button className="btn btn-xl btn-ghost" onClick={() => openSighting()}>
            <EyeIcon /> I Saw Someone
          </button>
        </div>
        <div className="stats-bar">
          {[
            ["247", "Active cases"],
            ["1,840", "Community volunteers"],
            ["312", "Reunited families"],
          ].map(([num, label]) => (
            <div key={label} className="stats-bar__cell">
              <div className="stats-bar__num">{num}</div>
              <div className="stats-bar__label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="mb-48">
        <div className="section-head">
          <div>
            <div className="section-title">Urgent cases</div>
            <div className="section-sub">Needs immediate community help right now</div>
          </div>
          <span className="section-link" onClick={() => navigate("cases")}>
            See all cases →
          </span>
        </div>
        <div className="cases-grid">
          {CASES.filter((c) => c.status !== "found").map((c, i) => (
            <div key={c.id} className={`fade-in fade-in-${i + 1}`}>
              <CaseCard c={c} onClick={() => navigate("case-detail", c.id)} />
            </div>
          ))}
        </div>
      </section>

      <section
        className="mb-48"
        style={{
          background: "linear-gradient(135deg, #f5f0ff 0%, #fdf4ff 100%)",
          border: "1px solid var(--purple-mid)",
          borderRadius: "var(--r-xl)",
          padding: "44px",
        }}
      >
        <div className="section-head">
          <div>
            <div className="section-title" style={{ color: "#3b0764" }}>
              Reconnection stories
            </div>
            <div className="section-sub" style={{ color: "#7c3aed" }}>
              People looking for someone from their past
            </div>
          </div>
          <span
            className="section-link"
            style={{ color: "var(--purple)" }}
            onClick={() => navigate("memories")}
          >
            Share your story →
          </span>
        </div>
        <div className="memory-grid">
          {MEMORIES.slice(0, 2).map((m, i) => (
            <div key={m.id} className={`fade-in fade-in-${i + 1}`}>
              <MemoryCard m={m} onClick={() => navigate("memory-detail", m.id)} />
            </div>
          ))}
        </div>
      </section>

      <div className="cta-block">
        <h2>Every minute matters</h2>
        <p>
          If you've seen someone matching a missing person description, report
          a sighting in under 60 seconds. You don't need an account.
        </p>
        <button className="btn btn-lg btn-orange" onClick={openSighting}>
          <EyeIcon /> I Saw Someone
        </button>
      </div>
    </div>
  );
}

export function CasesPage({ navigate, openSighting }) {
  const [filter, setFilter] = useState("all");
  const filtered =
    filter === "all" ? CASES : CASES.filter((c) => c.status === filter);

  return (
    <div className="page fade-in">
      <div className="mb-32">
        <h1
          className="text-serif"
          style={{
            fontSize: 38,
            color: "var(--navy)",
            fontWeight: 400,
            marginBottom: 8,
            letterSpacing: "-.4px",
          }}
        >
          Missing Persons
        </h1>
        <p className="text-muted" style={{ fontSize: 16 }}>
          Browse active cases and help bring families together. Every share
          counts.
        </p>
      </div>

      <div className="filter-bar">
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--gray-4)",
            marginRight: 4,
          }}
        >
          Filter:
        </span>
        {[
          ["all", "All cases"],
          ["critical", "Critical"],
          ["active", "Active"],
          ["found", "Found"],
        ].map(([val, label]) => (
          <button
            key={val}
            className={`filter-chip ${filter === val ? "filter-chip--active" : ""}`}
            onClick={() => setFilter(val)}
          >
            {label}
          </button>
        ))}
        <button
          className="btn btn-sm btn-ghost"
          style={{ marginLeft: "auto" }}
          onClick={() => navigate("map")}
        >
          <MapPinIcon /> Map view
        </button>
      </div>

      <div className="cases-grid">
        {filtered.map((c, i) => (
          <div key={c.id} className={`fade-in fade-in-${(i % 4) + 1}`}>
            <CaseCard c={c} onClick={() => navigate("case-detail", c.id)} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "var(--gray-4)",
          }}
        >
          No cases match this filter
        </div>
      )}

      <div style={{ marginTop: 40, textAlign: "center" }}>
        <button className="btn btn-lg btn-orange" onClick={() => navigate("report")}>
          <PlusIcon /> Report a Missing Person
        </button>
      </div>
    </div>
  );
}

export function MapPage({ navigate, openSighting }) {
  const [activeCase, setActiveCase] = useState(null);
  const [query, setQuery] = useState("");

  const filtered = CASES.filter(
    (c) =>
      !query ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.lastSeen.toLowerCase().includes(query.toLowerCase()),
  );

  const statusColor = (s) =>
    s === "critical"
      ? "var(--orange)"
      : s === "found"
        ? "var(--green)"
        : "var(--indigo)";
  const markerClass = (s) =>
    s === "critical"
      ? "marker-pin--critical"
      : s === "found"
        ? "marker-pin--found"
        : "marker-pin--active-s";

  return (
    <div className="map-page page--full fade-in">
      <div className="map-canvas">
        <div className="map-canvas__bg" />
        <svg
          className="map-canvas__roads"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M10,50 Q25,30 50,45 Q75,60 90,40"
            stroke="#2455c7"
            strokeWidth=".8"
            fill="none"
          />
          <path
            d="M5,70 Q20,65 40,70 Q60,75 80,60 Q90,55 95,65"
            stroke="#2455c7"
            strokeWidth=".5"
            fill="none"
            strokeDasharray="3,2"
          />
          <path d="M50,5 L48,95" stroke="#2455c7" strokeWidth=".5" fill="none" />
          <path d="M5,45 L95,47" stroke="#2455c7" strokeWidth=".5" fill="none" />
          <path
            d="M20,10 Q22,30 18,50 Q14,70 22,90"
            stroke="#2455c7"
            strokeWidth=".4"
            fill="none"
          />
          <path
            d="M70,8 Q68,28 72,50 Q76,72 70,92"
            stroke="#2455c7"
            strokeWidth=".4"
            fill="none"
          />
          <rect x="15" y="20" width="8" height="5" rx=".5" fill="#1a3a6b" opacity=".18" />
          <rect x="42" y="18" width="12" height="8" rx=".5" fill="#1a3a6b" opacity=".18" />
          <rect x="62" y="36" width="10" height="6" rx=".5" fill="#1a3a6b" opacity=".18" />
          <rect x="25" y="55" width="9" height="6" rx=".5" fill="#1a3a6b" opacity=".14" />
          <rect x="55" y="60" width="11" height="7" rx=".5" fill="#1a3a6b" opacity=".14" />
        </svg>

        <div className="map-canvas__label">
          <span className="map-canvas__live-dot" />
          Addis Ababa, Ethiopia — Live Cases
        </div>

        {CASES.map((c) => (
          <div
            key={c.id}
            className={`map-marker ${activeCase === c.id ? "map-marker--active" : ""}`}
            style={{ left: `${c.lng}%`, top: `${c.lat}%` }}
            onClick={() => setActiveCase(activeCase === c.id ? null : c.id)}
          >
            {activeCase === c.id && (
              <div className="marker-popup">
                <h4>{c.name}</h4>
                <p>
                  Age {c.age} · {c.status === "found" ? "✓ Found" : `Missing ${c.days}d`}
                </p>
                <p style={{ marginTop: 4, color: "var(--gray-4)" }}>{c.lastSeen}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("case-detail", c.id);
                  }}
                  style={{
                    marginTop: 10,
                    width: "100%",
                    padding: "8px",
                    background: "var(--navy)",
                    color: "white",
                    borderRadius: "var(--r-sm)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "var(--sans)",
                  }}
                >
                  View Full Case
                </button>
              </div>
            )}
            <div className={`marker-pin ${markerClass(c.status)}`} />
          </div>
        ))}

        <div className="map-legend">
          <div className="map-legend__title">Legend</div>
          <div className="legend-row">
            <span className="legend-dot" style={{ background: "var(--orange)" }} />
            Critical
          </div>
          <div className="legend-row">
            <span className="legend-dot" style={{ background: "var(--indigo)" }} />
            Active search
          </div>
          <div className="legend-row">
            <span className="legend-dot" style={{ background: "var(--green)" }} />
            Found / Reunited
          </div>
        </div>
      </div>

      <div className="map-sidebar">
        <div className="map-sidebar__head">
          <div className="map-sidebar__title">Active Cases</div>
          <input
            className="map-search"
            type="text"
            placeholder="Search by name or area…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="map-sidebar__list">
          {filtered.map((c) => (
            <div
              key={c.id}
              className={`map-case-item ${activeCase === c.id ? "map-case-item--selected" : ""}`}
              onClick={() => setActiveCase(activeCase === c.id ? null : c.id)}
            >
              <div className="map-case-item__header">
                <span className="map-case-item__dot" style={{ background: statusColor(c.status) }} />
                <span className="map-case-item__name">{c.name}</span>
              </div>
              <div className="map-case-item__detail">
                Age {c.age} · {c.status === "found" ? "✓ Found" : `${c.days}d missing`} ·{" "}
                {c.sightings} sightings
              </div>
              <div className="map-case-item__detail">{c.lastSeen}</div>
            </div>
          ))}
        </div>
        <div className="map-sidebar__footer">
          <button className="btn btn-md btn-orange btn-full" onClick={openSighting}>
            <EyeIcon /> Report a Sighting
          </button>
        </div>
      </div>
    </div>
  );
}

export function CaseDetailPage({ caseId, navigate, openSighting }) {
  const c = CASES.find((x) => x.id === caseId) || CASES[0];
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 200);
    return () => clearTimeout(t);
  }, []);

  const dotClass = (t) =>
    t === "orange" ? "tl-dot--orange" : t === "green" ? "tl-dot--green" : "";

  return (
    <div className="page fade-in">
      <BackBtn onClick={() => navigate("cases")} />

      <div className="case-hero mb-32">
        <div className="case-hero__inner">
          <div className="case-hero__avatar">{initials(c.name)}</div>
          <div className="case-hero__top">
            <div>
              <h1 className="case-hero__name">{c.name}</h1>
              <p className="case-hero__meta">
                Age {c.age} · {c.gender} · Last seen: {c.lastSeen}
              </p>
            </div>
            <div>
              {c.status === "critical" && <Badge type="critical">CRITICAL</Badge>}
              {c.status === "found" && <Badge type="found">✓ FOUND</Badge>}
              {c.status === "active" && <Badge type="active">Active</Badge>}
            </div>
          </div>
          <div className="case-hero__chips">
            <span className="chip-white">
              {c.status === "found"
                ? "✓ Reunited"
                : `Missing ${c.days} day${c.days !== 1 ? "s" : ""}`}
            </span>
            <span className="chip-white">
              {c.sightings} sighting{c.sightings !== 1 ? "s" : ""} reported
            </span>
            <span className="chip-white">Case #AA-{String(c.id).padStart(4, "0")}</span>
          </div>
        </div>
      </div>

      <div className="case-layout">
        <div>
          <div className="card info-card">
            <h3>Person details</h3>
            {[
              ["Height", c.height],
              ["Weight", c.weight],
              ["Last wearing", c.clothing],
              ["Distinctive features", c.distinctive],
            ].map(([label, val]) => (
              <div key={label} className="info-row">
                <span className="info-label">{label}</span>
                <span className="info-value">{val}</span>
              </div>
            ))}
          </div>

          <div className="card info-card">
            <h3>Background</h3>
            <p
              style={{
                fontSize: 15,
                color: "var(--gray-2)",
                lineHeight: 1.75,
              }}
            >
              {c.description}
            </p>
          </div>

          <div className="card info-card">
            <h3>Sighting timeline</h3>
            <div className="timeline">
              {c.timeline.map((t, i) => (
                <div key={i} className="tl-item">
                  <div className={`tl-dot ${dotClass(t.type)}`} />
                  <div className="tl-time">{t.time}</div>
                  <div className="tl-text">{t.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card info-card mb-20">
            <h3>Take action</h3>
            <button className="btn btn-md btn-orange btn-full mb-12" onClick={openSighting}>
              <EyeIcon /> I Saw This Person
            </button>
            <button
              className="btn btn-md btn-ghost-indigo btn-full mb-12"
              onClick={() => navigate("map")}
            >
              <MapPinIcon /> View on Map
            </button>
            <button
              className="btn btn-md btn-ghost btn-full"
              onClick={() => alert("Link copied to clipboard!")}
            >
              <ShareIcon /> Share This Case
            </button>
          </div>

          <div className="card info-card mb-20">
            <h3>Community hope meter</h3>
            <p
              style={{
                fontSize: 13,
                color: "var(--gray-4)",
                marginBottom: 18,
                lineHeight: 1.6,
              }}
            >
              Based on sightings, volunteer activity, and AI pattern analysis
            </p>
            <div className="hope-meter">
              <div className="hope-meter__header">
                <span className="hope-meter__label">Hope score</span>
                <span className="hope-meter__score">{c.hope}%</span>
              </div>
              <div className="hope-meter__track">
                <div className="hope-meter__fill" style={{ width: filled ? `${c.hope}%` : "0%" }} />
              </div>
              <div className="hope-meter__note">
                {c.hope >= 80
                  ? "🟢 Strong leads. Volunteer network very active in the area."
                  : c.hope >= 50
                    ? "🟡 Some good sightings. Community is actively searching."
                    : "🔴 Urgent. More community engagement needed immediately."}
              </div>
            </div>
          </div>

          <div className="card info-card">
            <h3>Contact a moderator</h3>
            <p
              style={{
                fontSize: 13,
                color: "var(--gray-3)",
                marginBottom: 16,
                lineHeight: 1.6,
              }}
            >
              Have sensitive information you don't want public? Connect with a
              verified REUNITE moderator.
            </p>
            <button
              className="btn btn-md btn-ghost-indigo btn-full"
              onClick={() => navigate("chat")}
            >
              💬 Message Moderator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReportPage({ navigate }) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    clothing: "",
    distinctive: "",
    lastSeen: "",
    date: "",
    time: "",
    description: "",
    contactName: "",
    phone: "",
    relation: "Parent",
  });

  function Field({ label, id, type = "text", placeholder, hint }) {
    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        <input
          className="form-input"
          type={type}
          placeholder={placeholder}
          value={form[id] || ""}
          onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
        />
        {hint && <div className="form-hint">{hint}</div>}
      </div>
    );
  }

  function TextareaField({ label, id, placeholder, hint }) {
    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        <textarea
          className="form-textarea"
          placeholder={placeholder}
          value={form[id] || ""}
          onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
        />
        {hint && <div className="form-hint">{hint}</div>}
      </div>
    );
  }

  const steps = ["Personal Info", "Last Seen", "Your Contact", "Review"];

  if (done) {
    return (
      <div className="page fade-in" style={{ maxWidth: 640, margin: "0 auto" }}>
        <div className="card" style={{ padding: "60px 40px" }}>
          <div className="success-box" style={{ padding: 0 }}>
            <div className="success-icon">✓</div>
            <div className="success-title">Case submitted</div>
            <div className="success-sub">
              Your report for <strong>{form.name || "the missing person"}</strong>{" "}
              has been received. Our team will review it within 30 minutes and
              publish it to the network.
              <br />
              <br />
              We'll contact you at {form.phone || "your number"} if there are any
              sightings.
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button className="btn btn-md btn-navy" onClick={() => navigate("cases")}>
                View All Cases
              </button>
              <button
                className="btn btn-md btn-ghost"
                onClick={() => {
                  setDone(false);
                  setStep(1);
                  setForm({});
                }}
              >
                Report Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-in" style={{ maxWidth: 740, margin: "0 auto" }}>
      <div className="mb-32">
        <h1
          className="text-serif"
          style={{
            fontSize: 34,
            color: "var(--navy)",
            fontWeight: 400,
            marginBottom: 8,
          }}
        >
          Report a Missing Person
        </h1>
        <p className="text-muted" style={{ fontSize: 16 }}>
          This takes under 2 minutes. Every detail matters.
        </p>
      </div>

      <div className="form-steps">
        {steps.map((s, i) => {
          const n = i + 1;
          return (
            <Fragment key={s}>
              {i > 0 && (
                <div
                  className={`form-step__line ${step > n ? "form-step__line--done" : ""}`}
                />
              )}
              <div
                className="form-step"
                style={{ flex: i === steps.length - 1 ? "0 0 auto" : 1 }}
              >
                <div
                  className={`form-step__circle ${step > n ? "form-step__circle--done" : step === n ? "form-step__circle--active" : ""}`}
                >
                  {step > n ? "✓" : n}
                </div>
                <span
                  className={`form-step__label ${step === n ? "form-step__label--active" : ""}`}
                >
                  {s}
                </span>
              </div>
            </Fragment>
          );
        })}
      </div>

      <div className="form-card">
        {step === 1 && (
          <>
            <div className="form-section-title">About the missing person</div>
            <div className="form-section-sub">
              Tell us who we're looking for — be as specific as possible
            </div>
            <Field label="Full Name *" id="name" placeholder="e.g. Selam Bekele" />
            <div className="form-row">
              <Field label="Age *" id="age" type="number" placeholder="Age" />
              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select
                  className="form-select"
                  value={form.gender}
                  onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                >
                  <option value="">Select…</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other / Prefer not to say</option>
                </select>
              </div>
            </div>
            <Field
              label="Clothing when last seen *"
              id="clothing"
              placeholder="e.g. Blue netela shawl, dark brown trousers, brown sandals"
            />
            <Field
              label="Distinctive features"
              id="distinctive"
              placeholder="Scars, birthmarks, glasses, walking aids, hairstyle…"
            />
            <div className="form-group">
              <label className="form-label">
                Photo (optional but highly recommended)
              </label>
              <div className="upload-zone">
                <div className="upload-zone__icon">📷</div>
                <div className="upload-zone__text">Tap to upload a recent photo</div>
                <div className="upload-zone__sub">
                  JPG or PNG · Max 10 MB · A photo increases recognition by 3×
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-section-title">Last known location</div>
            <div className="form-section-sub">
              Where and when were they last seen? Even rough details help.
            </div>
            <Field
              label="Location *"
              id="lastSeen"
              placeholder="e.g. Mercato Market, near the main east gate"
              hint="Be as specific as possible — street name, nearby landmark, area"
            />
            <div className="form-row">
              <Field label="Date *" id="date" type="date" />
              <Field label="Approximate time" id="time" type="time" />
            </div>
            <TextareaField
              label="Additional context"
              id="description"
              placeholder="Where were they going? Who were they with? Anything unusual about their behavior or plans that day?"
              hint="Include any context that might help volunteers or police understand the situation"
            />
          </>
        )}

        {step === 3 && (
          <>
            <div className="form-section-title">Your contact details</div>
            <div className="form-section-sub">
              So we can reach you with sightings and updates
            </div>
            <Field
              label="Your full name *"
              id="contactName"
              placeholder="Your name"
            />
            <Field
              label="Phone number *"
              id="phone"
              type="tel"
              placeholder="+251 9…"
              hint="Used only to share verified sightings — never published publicly"
            />
            <div className="form-group">
              <label className="form-label">
                Your relationship to the missing person *
              </label>
              <select
                className="form-select"
                value={form.relation}
                onChange={(e) => setForm((f) => ({ ...f, relation: e.target.value }))}
              >
                {[
                  "Parent",
                  "Spouse / Partner",
                  "Sibling",
                  "Child",
                  "Friend",
                  "Colleague",
                  "Neighbor",
                  "Other",
                ].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="form-info-box form-info-box--blue">
              🔒 Your contact details are kept private and encrypted. Only REUNITE
              moderators and approved volunteers can contact you — and only
              through our platform.
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="form-section-title">Review and submit</div>
            <div className="form-section-sub">
              Please confirm all details are accurate to the best of your
              knowledge
            </div>
            <div
              style={{
                background: "var(--gray-7)",
                borderRadius: "var(--r-md)",
                padding: 22,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 18,
                  paddingBottom: 18,
                  borderBottom: "1px solid var(--gray-5)",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "var(--navy)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontFamily: "var(--serif)",
                    fontSize: 24,
                    letterSpacing: "-.5px",
                  }}
                >
                  {initials(form.name || "??")}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 18,
                      color: "var(--navy)",
                    }}
                  >
                    {form.name || "(No name entered)"}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--gray-3)" }}>
                    {form.age ? `Age ${form.age}` : ""} {form.gender || ""}
                  </div>
                </div>
              </div>
              {[
                ["Last seen", form.lastSeen || "Not entered"],
                ["Clothing", form.clothing || "Not entered"],
                ["Distinctive features", form.distinctive || "None noted"],
                ["Reported by", `${form.contactName || "Unknown"} (${form.relation})`],
              ].map(([label, val]) => (
                <div key={label} className="info-row">
                  <span className="info-label">{label}</span>
                  <span className="info-value">{val}</span>
                </div>
              ))}
            </div>
            <div className="form-info-box form-info-box--orange">
              ⚠️ By submitting, you confirm this information is accurate to the
              best of your knowledge. False or misleading reports delay real
              searches and may have legal consequences.
            </div>
          </>
        )}

        <div className="form-actions">
          {step > 1 ? (
            <button className="btn btn-md btn-ghost" onClick={() => setStep((s) => s - 1)}>
              ← Back
            </button>
          ) : (
            <div />
          )}
          {step < 4 ? (
            <button className="btn btn-md btn-navy" onClick={() => setStep((s) => s + 1)}>
              Continue →
            </button>
          ) : (
            <button className="btn btn-md btn-green" onClick={() => setDone(true)}>
              Submit Report ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function MemoriesPage({ navigate }) {
  return (
    <div className="page fade-in">
      <div className="reconnect-hero">
        <h1>
          Reconnect with someone
          <br />
          from your past
        </h1>
        <p>
          Lost touch with a friend, family member, or someone who changed your
          life? Share your story — someone in the community might recognize
          them.
        </p>
        <button className="btn btn-lg btn-purple" onClick={() => navigate("create-memory")}>
          <HeartIcon /> Share my story
        </button>
      </div>

      <div className="section-head">
        <div>
          <div className="section-title">Memory posts</div>
          <div className="section-sub">
            {MEMORIES.length} stories posted · {MEMORIES.filter((m) => m.claimed).length} with active claims
          </div>
        </div>
        <span
          className="section-link"
          style={{ color: "var(--purple)" }}
          onClick={() => navigate("create-memory")}
        >
          + Add your story
        </span>
      </div>

      <div className="memory-grid">
        {MEMORIES.map((m, i) => (
          <div key={m.id} className={`fade-in fade-in-${(i % 4) + 1}`}>
            <MemoryCard m={m} onClick={() => navigate("memory-detail", m.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MemoryDetailPage({ memId, navigate }) {
  const m = MEMORIES.find((x) => x.id === memId) || MEMORIES[0];
  const [showClaim, setShowClaim] = useState(false);
  const [claimed, setClaimed] = useState(m.claimed);
  const [answer, setAnswer] = useState("");

  return (
    <div className="page fade-in" style={{ maxWidth: 800, margin: "0 auto" }}>
      <BackBtn onClick={() => navigate("memories")} />

      <div className="card" style={{ padding: 44, position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, var(--purple), #a78bfa)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 30,
          }}
        >
          <div className="memory-card__avatar" style={{ width: 56, height: 56, fontSize: 20 }}>
            {m.posterId}
          </div>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: "var(--gray-1)",
              }}
            >
              {m.poster}
            </div>
            <div
              style={{
                fontSize: 14,
                color: "var(--gray-4)",
                marginTop: 2,
              }}
            >
              Posted {m.posted} · {m.claimCount} claim{m.claimCount !== 1 ? "s" : ""} submitted
            </div>
          </div>
          {claimed && (
            <Badge type="found" style={{ marginLeft: "auto" }}>
              Claim pending review
            </Badge>
          )}
        </div>

        <blockquote
          style={{
            fontFamily: "var(--serif)",
            fontSize: 22,
            color: "var(--gray-1)",
            lineHeight: 1.7,
            fontStyle: "italic",
            borderLeft: "3px solid var(--purple-mid)",
            paddingLeft: 22,
            marginBottom: 30,
          }}
        >
          "{m.quote}"
        </blockquote>

        <div
          style={{
            background: "var(--gray-7)",
            borderRadius: "var(--r-md)",
            padding: 22,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: ".1em",
              color: "var(--gray-4)",
              marginBottom: 10,
            }}
          >
            Who I'm looking for
          </div>
          <p
            style={{
              fontSize: 15,
              color: "var(--gray-2)",
              lineHeight: 1.75,
            }}
          >
            {m.seekingDetail}
          </p>
        </div>

        <div className="memory-card__tags" style={{ marginBottom: 30 }}>
          {m.tags.map((t) => (
            <span key={t} className="memory-card__tag">
              {t}
            </span>
          ))}
        </div>

        <div className="divider" />

        {claimed ? (
          <div
            style={{
              background: "var(--green-light)",
              border: "1px solid var(--green-mid)",
              borderRadius: "var(--r-md)",
              padding: "18px 20px",
            }}
          >
            <p
              style={{
                fontSize: 15,
                color: "var(--green)",
                lineHeight: 1.65,
                fontWeight: 500,
              }}
            >
              ✓ Someone has submitted a claim for this memory. {m.poster} is
              reviewing it privately.
            </p>
          </div>
        ) : showClaim ? (
          <div>
            <div
              style={{
                fontSize: 20,
                fontFamily: "var(--serif)",
                color: "var(--navy)",
                marginBottom: 8,
              }}
            >
              Verify your identity
            </div>
            <p
              style={{
                fontSize: 15,
                color: "var(--gray-3)",
                marginBottom: 20,
                lineHeight: 1.6,
              }}
            >
              To protect everyone involved, we need to verify you actually know
              this person. Answer the secret question — only the right person
              would know.
            </p>
            <div className="form-group">
              <label className="form-label">
                Secret question: What was the name of the lake you used to race to?
              </label>
              <input
                className="form-input"
                type="text"
                placeholder="Your answer…"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <div className="form-hint">
                Your answer is encrypted — only {m.poster} will see if it's correct
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-md btn-ghost" onClick={() => setShowClaim(false)}>
                Cancel
              </button>
              <button
                className="btn btn-md btn-purple"
                onClick={() => {
                  setClaimed(true);
                  setShowClaim(false);
                }}
              >
                Submit Claim
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p
              style={{
                fontSize: 15,
                color: "var(--gray-2)",
                marginBottom: 18,
                lineHeight: 1.65,
              }}
            >
              Do you know who <strong>{m.poster}</strong> is looking for? Submit
              a claim — we'll ask you one private verification question before
              connecting you.
            </p>
            <button
              className="btn btn-lg btn-purple btn-full"
              onClick={() => setShowClaim(true)}
            >
              <HeartIcon /> I Know Who This Is
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CreateMemoryPage({ navigate }) {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="page fade-in" style={{ maxWidth: 700, margin: "0 auto" }}>
        <div className="card" style={{ padding: "60px 40px" }}>
          <div className="success-box" style={{ padding: 0 }}>
            <div className="success-icon" style={{ background: "var(--purple-light)", fontSize: 30 }}>
              💜
            </div>
            <div className="success-title">Your story is live</div>
            <div className="success-sub">
              Your memory post has been published to the REUNITE network. Someone
              who knows this person may reach out — we'll notify you
              immediately.
            </div>
            <button className="btn btn-lg btn-purple" onClick={() => navigate("memories")}>
              Back to Stories
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-in" style={{ maxWidth: 720, margin: "0 auto" }}>
      <div className="mb-32">
        <div
          style={{
            display: "inline-block",
            background: "var(--purple-light)",
            border: "1px solid var(--purple-mid)",
            borderRadius: "var(--r-full)",
            padding: "7px 18px",
            fontSize: 13,
            color: "var(--purple)",
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          Reconnection Story
        </div>
        <h1
          className="text-serif"
          style={{
            fontSize: 34,
            color: "#3b0764",
            fontWeight: 400,
            marginBottom: 8,
          }}
        >
          Tell your story
        </h1>
        <p className="text-muted" style={{ fontSize: 16 }}>
          Someone out there might recognize who you're looking for
        </p>
      </div>

      <div className="form-card">
        <div className="form-group">
          <label className="form-label">
            Your opening memory (make it vivid and human) *
          </label>
          <textarea
            className="form-textarea"
            style={{ minHeight: 140 }}
            placeholder={
              'e.g. "We grew up on the same street in Bahir Dar. Every Sunday we would race barefoot to the lake…"'
            }
          />
          <div className="form-hint">
            This is the first thing people read. Specific, emotional details
            make your story findable and memorable.
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Who are you looking for? *</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. My childhood friend Hana Tadesse, around 34 now"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Details that could help identify them</label>
          <textarea
            className="form-textarea"
            placeholder="Name, approximate age, hometown, school or workplace, family members' names, any physical details you remember…"
          />
        </div>
        <div className="form-group">
          <label className="form-label">When and where did you lose touch?</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. After I moved from Bahir Dar to Addis Ababa in 2005"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Your secret verification question *</label>
          <input
            className="form-input"
            type="text"
            placeholder='e.g. "What was the name of our primary school?" or "What game did we always play after church?"'
          />
          <div className="form-hint">
            Only the real person would know the answer. We use this to protect
            you both from false claims.
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">
            Answer to your secret question (encrypted) *
          </label>
          <input
            className="form-input"
            type="password"
            placeholder="Your answer — only you can see this"
          />
        </div>
        <div
          className="form-info-box form-info-box--purple"
          style={{ marginBottom: 0 }}
        >
          🔒 Your secret answer is end-to-end encrypted. No moderator can read it.
          When someone submits a claim, we compare their answer to yours — and
          only notify you if it matches.
        </div>
        <div className="form-actions">
          <button className="btn btn-md btn-ghost" onClick={() => navigate("memories")}>
            Cancel
          </button>
          <button className="btn btn-md btn-purple" onClick={() => setDone(true)}>
            Publish Story →
          </button>
        </div>
      </div>
    </div>
  );
}

export function LoginPage({ navigate, onLogin }) {
  const [mode, setMode] = useState("login");

  return (
    <div className="auth-wrap">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          REUNITE <span className="logo__dot" style={{ display: "inline-block" }} />
        </div>
        <div className="auth-title">
          {mode === "login" ? "Welcome back" : "Join the network"}
        </div>
        <div className="auth-sub">
          {mode === "login"
            ? "Sign in to manage cases and connect with our volunteer network"
            : "Create a free account to report cases, track sightings, and help reunite families"}
        </div>

        {mode === "signup" && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" type="text" placeholder="e.g. Amara Gebru" />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-input" type="email" placeholder="you@example.com" />
        </div>
        <div className="form-group" style={{ marginBottom: 28 }}>
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" />
        </div>

        <button
          className="btn btn-lg btn-navy btn-full"
          onClick={() => {
            onLogin();
            navigate("profile");
          }}
        >
          {mode === "login" ? "Sign In →" : "Create Account →"}
        </button>

        {mode === "login" && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span style={{ fontSize: 13, color: "var(--gray-4)" }}>Forgot password? </span>
            <span
              style={{
                fontSize: 13,
                color: "var(--indigo)",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Reset it
            </span>
          </div>
        )}

        <div className="auth-divider" style={{ marginTop: 22 }}>
          {mode === "login" ? (
            <>
              Don't have an account? <span onClick={() => setMode("signup")}>Sign up free</span>
            </>
          ) : (
            <>
              Already have an account? <span onClick={() => setMode("login")}>Sign in</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProfilePage({ navigate, onLogout }) {
  const [volunteer, setVolunteer] = useState(true);

  return (
    <div className="page fade-in">
      <div className="profile-hero">
        <div className="profile-avatar">AM</div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="profile-name">Amara Mekonen</div>
          <div className="profile-role">
            Community Volunteer · Member since April 2024
          </div>
          <div className="volunteer-toggle" onClick={() => setVolunteer((v) => !v)}>
            <div className={`toggle-sw ${volunteer ? "toggle-sw--on" : ""}`}>
              <div className="toggle-thumb" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {volunteer ? "🟢 Available to help" : "⚫ Offline"}
            </span>
          </div>
        </div>
      </div>

      <div className="admin-stats">
        {[
          ["12", "Cases helped"],
          ["7", "Sightings reported"],
          ["3", "Reconnections"],
          ["24h", "Volunteer time"],
        ].map(([num, label]) => (
          <div key={label} className="admin-stat">
            <div className="admin-stat__num">{num}</div>
            <div className="admin-stat__label">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card info-card">
          <h3>My reported cases</h3>
          {CASES.slice(0, 3).map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 0",
                borderBottom: "1px solid var(--gray-7)",
                cursor: "pointer",
              }}
              onClick={() => navigate("case-detail", c.id)}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "var(--indigo-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "var(--indigo)",
                  fontFamily: "var(--serif)",
                  flexShrink: 0,
                }}
              >
                {initials(c.name)}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--gray-1)",
                  }}
                >
                  {c.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--gray-4)" }}>
                  {c.status === "found" ? "✓ Reunited" : `${c.days}d missing`}
                </div>
              </div>
              <Badge
                type={
                  c.status === "found"
                    ? "found"
                    : c.status === "critical"
                      ? "critical"
                      : "active"
                }
              >
                {c.status}
              </Badge>
            </div>
          ))}
        </div>

        <div>
          <div className="card info-card mb-20">
            <h3>Quick actions</h3>
            <button className="btn btn-md btn-orange btn-full mb-12" onClick={() => navigate("report")}>
              <PlusIcon /> Report Missing Person
            </button>
            <button className="btn btn-md btn-ghost-purple btn-full mb-12" onClick={() => navigate("create-memory")}>
              <HeartIcon /> Share a Memory
            </button>
            <button className="btn btn-md btn-ghost-indigo btn-full" onClick={() => navigate("map")}>
              <MapPinIcon /> Open Live Map
            </button>
          </div>

          <div className="card info-card">
            <h3>Account</h3>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">amara.m@gmail.com</span>
            </div>
            <div className="info-row">
              <span className="info-label">Role</span>
              <span className="info-value">Verified volunteer</span>
            </div>
            <div className="info-row">
              <span className="info-label">Location</span>
              <span className="info-value">Addis Ababa, Ethiopia</span>
            </div>
            <div style={{ marginTop: 18 }}>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  onLogout();
                  navigate("home");
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminPage({ navigate }) {
  const [tab, setTab] = useState(0);
  const [approved, setApproved] = useState({});

  return (
    <div className="page fade-in">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1
            className="text-serif"
            style={{
              fontSize: 36,
              color: "var(--navy)",
              fontWeight: 400,
              marginBottom: 6,
            }}
          >
            Admin Dashboard
          </h1>
          <p className="text-muted" style={{ fontSize: 16 }}>
            Case moderation, platform oversight, and analytics
          </p>
        </div>
        <Badge type="critical">3 pending reviews</Badge>
      </div>

      <div className="admin-stats">
        {[
          ["247", "Active cases", "↑ 12 this week", "up"],
          ["3", "Pending review", "Needs attention", "warn"],
          ["312", "Families reunited", "↑ 4 this month", "up"],
          ["48", "Volunteers online", "Active right now", "up"],
        ].map(([num, label, delta, type]) => (
          <div key={label} className="admin-stat">
            <div className="admin-stat__num">{num}</div>
            <div className="admin-stat__label">{label}</div>
            <div className={`admin-stat__delta admin-stat__delta--${type}`}>{delta}</div>
          </div>
        ))}
      </div>

      <div className="tabs">
        {["Moderation queue", "All cases", "Analytics"].map((t, i) => (
          <button key={t} className={`tab ${tab === i ? "tab--active" : ""}`} onClick={() => setTab(i)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <>
          <div
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: "var(--gray-2)",
              marginBottom: 16,
            }}
          >
            Pending review ({CASES.filter((c) => !approved[c.id]).length})
          </div>
          {CASES.map((c) =>
            approved[c.id] ? null : (
              <div key={c.id} className="queue-item">
                <div className="queue-avatar">{initials(c.name)}</div>
                <div style={{ flex: 1 }}>
                  <div className="queue-name">{c.name}</div>
                  <div className="queue-detail">
                    Submitted {c.days}d ago · {c.lastSeen} · {c.sightings} sightings
                  </div>
                </div>
                <div className="queue-btns">
                  <button
                    className="btn-approve"
                    onClick={() => setApproved((a) => ({ ...a, [c.id]: "approved" }))}
                  >
                    ✓ Approve
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => setApproved((a) => ({ ...a, [c.id]: "rejected" }))}
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            ),
          )}
          {CASES.every((c) => approved[c.id]) && (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "var(--gray-4)",
              }}
            >
              🎉 All cases reviewed. Queue is clear.
            </div>
          )}
        </>
      )}

      {tab === 1 && (
        <div className="cases-grid">
          {CASES.map((c) => (
            <CaseCard key={c.id} c={c} onClick={() => navigate("case-detail", c.id)} />
          ))}
        </div>
      )}

      {tab === 2 && (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "var(--gray-4)",
            background: "var(--white)",
            borderRadius: "var(--r-lg)",
            border: "1px solid var(--gray-5)",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 22,
              color: "var(--navy)",
              marginBottom: 8,
            }}
          >
            Analytics coming soon
          </div>
          <div style={{ fontSize: 15 }}>
            Case resolution rates, geographic heatmaps, and volunteer
            performance metrics
          </div>
        </div>
      )}
    </div>
  );
}

export function ChatPage({ navigate }) {
  const [msgs, setMsgs] = useState([
    {
      id: 1,
      mine: false,
      text: "Hi, I saw the post about Selam Bekele. I think I may have seen her near Bole Michael yesterday evening.",
      time: "2:15 PM",
    },
    {
      id: 2,
      mine: true,
      text: "Thank you so much for reaching out. Can you describe exactly what she was wearing?",
      time: "2:17 PM",
    },
    {
      id: 3,
      mine: false,
      text: "She had a blue shawl and was carrying a small green bag. She looked a bit lost but she seemed okay. She was near the church.",
      time: "2:18 PM",
    },
    {
      id: 4,
      mine: true,
      text: "This matches! Bole Michael is about 4km from her last known location. Did she seem hurt or distressed?",
      time: "2:19 PM",
    },
  ]);
  const [input, setInput] = useState("");
  const msgsRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [msgs]);

  function send() {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      mine: true,
      text: input,
      time: "Now",
    };
    setMsgs((m) => [...m, newMsg]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          id: Date.now() + 1,
          mine: false,
          time: "Now",
          text: "Thank you for this information. I'm forwarding it to the family and local police immediately. Please stay available in case we need more details.",
        },
      ]);
    }, 1400);
  }

  return (
    <div className="page fade-in" style={{ maxWidth: 740, margin: "0 auto" }}>
      <BackBtn onClick={() => navigate("case-detail", 1)} />
      <div className="chat-wrap">
        <div className="chat-header">
          <div className="chat-header-av">MK</div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "var(--gray-1)",
              }}
            >
              Moderator Kidist
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--green)",
                fontWeight: 600,
              }}
            >
              ● Online — Verified REUNITE moderator
            </div>
          </div>
          <Badge type="active">Selam Bekele Case</Badge>
        </div>

        <div className="chat-msgs" ref={msgsRef}>
          {msgs.map((m) => (
            <div key={m.id} className={`msg ${m.mine ? "msg--mine" : ""}`}>
              {!m.mine && <div className="msg-av">MK</div>}
              <div>
                <div className="msg-bubble">{m.text}</div>
                <div className="msg-time" style={{ textAlign: m.mine ? "right" : "left" }}>
                  {m.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-bar">
          <input
            className="chat-input"
            type="text"
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            className="btn btn-md btn-navy"
            onClick={send}
            style={{
              borderRadius: "var(--r-full)",
              padding: "10px 20px",
            }}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
