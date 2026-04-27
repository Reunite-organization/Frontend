import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Clock, ArrowRight, ShieldAlert } from "lucide-react";
import { caseService } from "../services/caseService";
import { useAuth } from "../hooks/useAuth";
import {
  formatDateTime,
  formatRelativeTime,
  getCaseAddress,
  getCaseImageSource,
  getCaseLastSeenAt,
  getCaseSummary,
  getPriorityClasses,
  getStatusClasses,
} from "../lib/caseFormatting";
import { isAdminRole } from "../lib/authRoles";

const defaultStats = {
  total: 0,
  today: 0,
  byStatus: [],
};

export const MissingCasesPage = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("active");
  const [query, setQuery] = useState("");

  const activeCount = useMemo(
    () => stats.byStatus.find((item) => item._id === "active")?.count || 0,
    [stats],
  );

  const resolvedCount = useMemo(
    () => stats.byStatus.find((item) => item._id === "resolved")?.count || 0,
    [stats],
  );

  const highPriorityCount = useMemo(
    () => stats.byStatus.find((item) => item._id === "active")?.highPriority || 0,
    [stats],
  );
  const canAccessAdmin = isAdminRole(user?.role);

  const loadStats = async () => {
    const response = await caseService.getStats();
    setStats(response.data || defaultStats);
  };

  const loadCases = async (nextStatus = status, nextQuery = query) => {
    setLoading(true);
    try {
      const response = nextQuery.trim()
        ? await caseService.searchCases(nextQuery.trim(), nextStatus || undefined)
        : await caseService.getAllCases({
            status: nextStatus === "all" ? undefined : nextStatus,
            limit: 40,
          });

      setCases(response.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.allSettled([loadStats(), loadCases("active", "")]);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-terracotta">
                Missing Person Operations
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-charcoal">
                Active cases, live priorities, and search readiness in one place
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-stone">
                This view is aligned to the backend case system. You can review
                open reports, inspect urgency, follow sightings, and move
                directly into reporting or coordination work.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/report"
                  className="rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white transition hover:bg-clay"
                >
                  Report Missing Person
                </Link>
                {canAccessAdmin ? (
                  <Link
                    to="/admin"
                    className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
                  >
                    Open Command Center
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { label: "Active cases", value: activeCount },
                { label: "High priority", value: highPriorityCount },
                { label: "Resolved", value: resolvedCount },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-stone-200 bg-stone-50 p-5"
                >
                  <p className="text-sm text-stone-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-charcoal">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-3xl border border-stone-200 bg-white p-5 lg:grid-cols-[1fr_auto_auto]">
          <label className="flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3">
            <Search className="h-4 w-4 text-stone-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, case ID, or description"
              className="w-full bg-transparent text-sm text-charcoal outline-none"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  loadCases(status, query);
                }
              }}
            />
          </label>

          <select
            value={status}
            onChange={(event) => {
              const nextStatus = event.target.value;
              setStatus(nextStatus);
              loadCases(nextStatus, query);
            }}
            className="rounded-2xl border border-stone-200 px-4 py-3 text-sm text-charcoal outline-none"
          >
            <option value="active">Active</option>
            <option value="pending_verification">Pending verification</option>
            <option value="resolved">Resolved</option>
            <option value="all">All cases</option>
          </select>

          <button
            type="button"
            onClick={() => loadCases(status, query)}
            className="rounded-2xl bg-charcoal px-5 py-3 text-sm font-semibold text-white transition hover:bg-charcoal/90"
          >
            Refresh
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: "Total reports", value: stats.total },
            { label: "Reports today", value: stats.today },
            {
              label: "Urgent share load",
              value: `${highPriorityCount} high-priority alerts`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-stone-200 bg-white p-5"
            >
              <p className="text-sm text-stone-500">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-charcoal">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center text-stone-500">
              Loading cases...
            </div>
          ) : cases.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center">
              <ShieldAlert className="mx-auto h-10 w-10 text-stone-400" />
              <h2 className="mt-4 text-xl font-semibold text-charcoal">
                No cases matched this view
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                Try another filter or start a new missing-person report.
              </p>
            </div>
          ) : (
            cases.map((caseItem) => (
              <Link
                key={caseItem.caseId}
                to={`/cases/${caseItem.caseId}`}
                className="block rounded-3xl border border-stone-200 bg-white p-6 transition hover:border-terracotta/30 hover:shadow-lg"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {getCaseImageSource(caseItem) ? (
                    <img
                      src={getCaseImageSource(caseItem)}
                      alt={caseItem.person?.name || "Case"}
                      className="h-28 w-28 rounded-2xl object-cover"
                    />
                  ) : null}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(caseItem.priority?.level)}`}
                      >
                        {caseItem.priority?.level || "UNKNOWN"} priority
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(caseItem.status)}`}
                      >
                        {(caseItem.status || "unknown").replaceAll("_", " ")}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-charcoal">
                        {caseItem.person?.name || "Unknown person"}
                      </h2>
                      <p className="mt-1 text-sm text-stone-500">
                        Case ID: {caseItem.caseId}
                      </p>
                    </div>

                    <p className="max-w-3xl text-sm leading-7 text-stone-700">
                      {getCaseSummary(caseItem)}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-stone-600">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-terracotta" />
                        {getCaseAddress(caseItem)}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Clock className="h-4 w-4 text-terracotta" />
                        {formatRelativeTime(getCaseLastSeenAt(caseItem))}
                      </span>
                      <span className="text-stone-500">
                        Last seen: {formatDateTime(getCaseLastSeenAt(caseItem))}
                      </span>
                    </div>
                  </div>

                  <div className="flex min-w-[12rem] flex-col items-start gap-3 lg:items-end">
                    <div className="text-sm text-stone-500">
                      <div>Sightings: {caseItem.sightings?.length || 0}</div>
                      <div>
                        Volunteers: {caseItem.assignedVolunteers?.length || 0}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-charcoal px-4 py-2 text-sm font-semibold text-white">
                      Open case details
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default MissingCasesPage;
