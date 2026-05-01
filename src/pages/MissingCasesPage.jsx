import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Clock, ArrowRight, ShieldAlert, Filter, ChevronDown } from "lucide-react";
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
  const { user, isAuthenticated } = useAuth();
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("active");
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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
    <div className="min-h-screen bg-stone-50 mt-16">
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
                This view is aligned to the  case system. You can review
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
                <Link
                  to="/volunteers"
                  className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
                >
                  {isAuthenticated ? "Register as volunteer" : "Sign in to volunteer"}
                </Link>
              </div>
            </div>

            { canAccessAdmin && <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
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
            </div>}
          </div>
        </div>
      </section>

      {/* Search and Filter Section - Redesigned */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, location, or date"
              className="w-full rounded-2xl border border-stone-200 bg-white py-3.5 pl-12 pr-4 text-sm text-charcoal outline-none transition placeholder:text-stone-400 focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  loadCases(status, query);
                }
              }}
            />
          </div>

          {/* Filter Button */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className=" inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 "
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={`h-4 w-4 transition ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => loadCases(status, query)}
className="rounded-2xl bg-terracotta px-6 py-3.5 text-base font-semibold text-white transition hover:bg-terracotta/90 dark:bg-orange-600 dark:hover:bg-orange-700"            >
              Search
            </button>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-3 rounded-2xl border border-stone-200 bg-white p-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(event) => {
                    const nextStatus = event.target.value;
                    setStatus(nextStatus);
                    loadCases(nextStatus, query);
                  }}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-charcoal outline-none focus:border-terracotta/50"
                >
                  <option value="active">Active</option>
                  <option value="pending_verification">Pending verification</option>
                  <option value="resolved">Resolved</option>
                  <option value="all">All cases</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={() => {
                    // Sort by recent or filter by priority
                    loadCases(status, query);
                  }}
                  className="rounded-full bg-terracotta/10 px-4 py-2 text-xs font-semibold text-terracotta transition hover:bg-terracotta/20"
                >
                  Recently
                </button>
                <button
                  onClick={() => {
                    // Filter high priority
                    setStatus("active");
                    loadCases("active", query);
                  }}
            className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-4 
            py-2 text-xs font-semibold text-white shadow-sm transition
             hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400/40"                >
                  High Priority
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Quick Stats - Redesigned */}
      {/* Quick Stats - Improved Visibility */}
<section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-3 gap-3 sm:gap-4">

    {/* 🟠 ACTIVE */}
  <div className="rounded-2xl border border-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 p-4 text-center sm:p-5">
  <p className="text-xl font-extrabold text-yellow-700 dark:text-yellow-300 sm:text-2xl">
    {activeCount}
  </p>
  <p className="mt-1 text-sm font-bold text-yellow-800 dark:text-yellow-200">
    Active
  </p>
</div>

    {/* 🔴 HIGH PRIORITY */}
    <div className="rounded-2xl border border-red-300 bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-900/30 dark:to-orange-900/30 p-4 text-center sm:p-5">
      <p className="text-xl font-extrabold text-red-600 dark:text-red-400 sm:text-2xl">
        {highPriorityCount}
      </p>
      <p className="mt-1 text-sm font-bold text-red-700 dark:text-red-300">
        High Priority
      </p>
    </div>

    {/* 🟢 RESOLVED */}
    <div className="rounded-2xl border border-green-300 bg-green-100 dark:bg-green-900/30 p-4 text-center sm:p-5">
      <p className="text-xl font-extrabold text-green-700 dark:text-green-400 sm:text-2xl">
        {resolvedCount}
      </p>
      <p className="mt-1 text-sm font-bold text-green-800 dark:text-green-300">
        Resolved
      </p>
    </div>

  </div>
</section>

      {/* Cases Grid - Redesigned */}
      <section className="mx-auto max-w-8xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-stone-500">
            {loading ? 'Loading cases...' : `${cases.length} ${cases.length === 1 ? 'case' : 'cases'} found`}
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-3xl border border-stone-200 bg-white p-6">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="h-40 w-full rounded-2xl bg-stone-200 sm:h-36 sm:w-36" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-20 rounded-full bg-stone-200" />
                    <div className="h-6 w-40 rounded bg-stone-200" />
                    <div className="h-4 w-full rounded bg-stone-200" />
                    <div className="h-4 w-3/4 rounded bg-stone-200" />
                    <div className="flex gap-2">
                      <div className="h-4 w-24 rounded bg-stone-200" />
                      <div className="h-4 w-24 rounded bg-stone-200" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : cases.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-16 text-center">
            <ShieldAlert className="mx-auto h-12 w-12 text-stone-400" />
            <h2 className="mt-4 text-xl font-semibold text-charcoal">
              No cases matched this view
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Try another filter or start a new missing-person report.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {cases.map((caseItem) => (
              <Link
                key={caseItem.caseId}
                to={`/cases/${caseItem.caseId}`}
                className="group block rounded-3xl border border-stone-200 bg-white p-5 transition hover:border-terracotta/30 hover:shadow-lg sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* Image Section */}
                  <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-stone-100 sm:h-56 sm:w-36 lg:h-70 lg:w-70 flex-shrink-0">
                    {getCaseImageSource(caseItem) ? (
                      <img
                        src={getCaseImageSource(caseItem)}
                        alt={caseItem.person?.name || "Missing person"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-stone-200">
                        <ShieldAlert className="h-10 w-10 text-stone-400" />
                      </div>
                    )}
                    {/* Priority Badge on Image */}
                    <span
                      className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur-md ${
                        caseItem.priority?.level === 'high' 
                          ? 'bg-red-500/90 text-white' 
                          : caseItem.priority?.level === 'medium'
                          ? 'bg-amber-500/90 text-white'
                          : 'bg-stone-500/90 text-white'
                      }`}
                    >
                      {caseItem.priority?.level || "NORMAL"}
                    </span>
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="space-y-2">
                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                            caseItem.status === 'active'
                              ? 'bg-red-50 text-red-700'
                              : caseItem.status === 'resolved'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            caseItem.status === 'active' 
                              ? 'bg-red-500 animate-pulse' 
                              : caseItem.status === 'resolved'
                              ? 'bg-green-500'
                              : 'bg-amber-500'
                          }`} />
                          {(caseItem.status || "unknown").replaceAll("_", " ")}
                        </span>
                      </div>

                      {/* Name and Age */}
                      <div>
                        <h3 className="text-lg font-bold text-charcoal group-hover:text-terracotta transition-colors sm:text-xl">
                          {caseItem.person?.name || "Unknown person"}
                        </h3>
                        {caseItem.person?.age && (
                          <p className="text-sm font-medium text-stone-500">
                            Age {caseItem.person.age}
                          </p>
                        )}
                      </div>

                      {/* Summary */}
                      <p className="line-clamp-2 text-sm leading-6 text-stone-600">
                        {getCaseSummary(caseItem)}
                      </p>

                      {/* Location and Time */}
                      <div className="flex flex-col gap-1.5 pt-1">
                        <div className="flex items-center gap-2 text-sm text-stone-600">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-terracotta" />
                          <span className="font-medium">Last seen:</span>
                          <span className="text-stone-700">
                            {getCaseAddress(caseItem)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500">
                          <Clock className="h-3.5 w-3.5 flex-shrink-0 text-terracotta" />
                          <span>{formatRelativeTime(getCaseLastSeenAt(caseItem))}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">{formatDateTime(getCaseLastSeenAt(caseItem))}</span>
                        </div>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
                      <div className="flex items-center gap-3 text-xs text-stone-500">
                        <span>{caseItem.sightings?.length || 0} sightings</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{caseItem.assignedVolunteers?.length || 0} volunteers</span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xl font-medium text-terracotta transition group-hover:gap-2  p-2 rounded-md">
                        Open Case Details
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MissingCasesPage;
