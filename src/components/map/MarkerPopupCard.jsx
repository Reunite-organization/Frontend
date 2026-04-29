import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { markerStatusStyles } from "./statusStyles";

export default function MarkerPopupCard({ location, onClose }) {
  const initials = location.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const status =
    markerStatusStyles[location.status] || markerStatusStyles.Active;
  const locationLabel = location.lastSeen.split(",").slice(0, 2).join(",").trim();

  return (
    <div className="popup-card-enter w-72 rounded-[26px] bg-[#f7f1e8] p-1.5 text-charcoal transition-transform duration-300 ease-out hover:scale-[1.02]">
      <div className="overflow-hidden rounded-[22px] border border-[#ebe2d6] bg-white shadow-[0_18px_40px_rgba(44,40,37,0.12)] transition-shadow duration-300 ease-out hover:shadow-[0_22px_50px_rgba(44,40,37,0.16)]">
        <div className="bg-[linear-gradient(135deg,rgba(212,165,74,0.10),rgba(91,140,111,0.08))] px-4 pb-4 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
              Case Snapshot
            </p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-white/90 text-stone-500 transition hover:border-stone-300 hover:text-charcoal"
              aria-label="Close popup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-start gap-3">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${location.avatarTone || "from-[#c4654a] to-[#e2b36c]"} text-base font-semibold text-white shadow-[0_12px_24px_rgba(44,40,37,0.16)]`}
            >
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[17px] font-semibold leading-tight text-charcoal">
                    {location.name}
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                    Missing person profile
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${status.badge}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  {location.status}
                </span>
              </div>
              {location.city ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-stone-200 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-600">
                    {location.city}
                  </span>
                </div>
              ) : null}
              <p className="mt-2 text-sm leading-5 text-stone-600">
                Review the latest status, sightings, and last seen details.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-4 pb-4 pt-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-stone-50 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                Age
              </p>
              <p className="mt-1 text-sm font-semibold text-charcoal">
                {location.age} years
              </p>
            </div>

            <div className="rounded-2xl bg-stone-50 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                Sightings
              </p>
              <p className="mt-1 text-sm font-semibold text-charcoal">
                {location.sightingsCount} reports
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#efe5d8] bg-[#fcfaf6] px-3.5 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                Last Seen
              </p>
              <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-600">
                {locationLabel}
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-6 text-stone-700">
              {location.lastSeen}
            </p>
          </div>

          <Link
            to={`/cases/${location.caseId}`}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-terracotta px-4 py-3 text-sm font-semibold text-white transition hover:bg-clay"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
