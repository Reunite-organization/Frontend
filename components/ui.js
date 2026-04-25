import { ArrowLeft } from "./icons";
import { initials } from "../lib/site-data";

export function Badge({ type, children, style }) {
  return (
    <span style={style} className={`badge badge-${type}`}>
      {children}
    </span>
  );
}

export function BackBtn({ onClick }) {
  return (
    <button
      className="btn btn-sm btn-ghost mb-20"
      style={{ display: "inline-flex", gap: 6 }}
      onClick={onClick}
    >
      <ArrowLeft /> Back
    </button>
  );
}

export function CaseCard({ c, onClick }) {
  const isCritical = c.status === "critical";
  const isFound = c.status === "found";
  const imgClass = isCritical
    ? "case-card__img--critical"
    : isFound
      ? "case-card__img--found"
      : "";

  return (
    <div
      className="card card--hover case-card fade-in"
      onClick={() => onClick(c.id)}
    >
      <div className={`case-card__img ${imgClass}`}>
        <div className="case-card__avatar">{initials(c.name)}</div>
        <div className="case-card__badge-wrap">
          {isCritical && <Badge type="critical">CRITICAL</Badge>}
          {isFound && <Badge type="found">✓ FOUND</Badge>}
          {!isCritical && !isFound && <Badge type="active">Active</Badge>}
        </div>
        {!isFound && <div className="case-card__days-wrap">{c.days}d missing</div>}
      </div>
      <div className="case-card__body">
        <div className="case-card__name">{c.name}</div>
        <div className="case-card__meta">
          Age {c.age} · {c.gender}
          <br />
          Last seen: {c.lastSeen}
        </div>
        <div className="case-card__clothing">
          <div className="case-card__clothing-label">Last wearing</div>
          {c.clothing}
        </div>
        <div className="case-card__footer">
          <span
            className={`case-card__urgency ${isFound ? "case-card__urgency--found" : ""}`}
          >
            {isFound ? "✓ Reunited" : `${c.days} day${c.days !== 1 ? "s" : ""} missing`}
          </span>
          <span className="case-card__sightings">
            {c.sightings} sighting{c.sightings !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}

export function MemoryCard({ m, onClick }) {
  return (
    <div
      className="card card--hover memory-card fade-in"
      onClick={() => onClick(m.id)}
    >
      <div className="memory-card__who">
        <div className="memory-card__avatar">{m.posterId}</div>
        <div>
          <div className="memory-card__poster-name">{m.poster}</div>
          <div className="memory-card__poster-sub">Posted {m.posted}</div>
        </div>
        {m.claimed && (
          <div style={{ marginLeft: "auto" }}>
            <Badge type="found" style={{ fontSize: 11 }}>
              Claim pending
            </Badge>
          </div>
        )}
      </div>
      <div className="memory-card__quote">
        "{m.quote.slice(0, 150)}
        {m.quote.length > 150 ? "…" : ""}"
      </div>
      <div className="memory-card__seeking">
        <strong style={{ color: "var(--gray-1)", fontWeight: 700 }}>Seeking:</strong>{" "}
        {m.seeking}
      </div>
      <div className="memory-card__tags">
        {m.tags.map((t) => (
          <span key={t} className="memory-card__tag">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
