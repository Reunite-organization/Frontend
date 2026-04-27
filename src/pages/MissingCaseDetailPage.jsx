import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  MapPin,
  RefreshCw,
  Share2,
  Sparkles,
  Target,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import api from "../services/api";
import { caseService } from "../services/caseService";
import { useAuth } from "../hooks/useAuth";
import { geocodeLocation } from "../services/locationService";
import {
  buildGoogleMapsUrl,
  formatDateTime,
  formatRelativeTime,
  getCaseAddress,
  getCaseCoordinates,
  getCaseImageSource,
  getCaseLastSeenAt,
  getCaseSummary,
  getPriorityClasses,
  getStatusClasses,
  parseCommaSeparated,
} from "../lib/caseFormatting";
import { isAdminRole, isVolunteerRole } from "../lib/authRoles";

const initialSighting = {
  address: "",
  description: "",
  clothing: "",
  confidence: 70,
};

export const MissingCaseDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [strategy, setStrategy] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [sightingForm, setSightingForm] = useState(initialSighting);
  const [resolvedSightingLocation, setResolvedSightingLocation] = useState(null);
  const [submittingSighting, setSubmittingSighting] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [resolvingSightingLocation, setResolvingSightingLocation] =
    useState(false);

  const volunteerDeviceId =
    typeof window !== "undefined"
      ? window.localStorage.getItem("reunite-volunteer-device-id")
      : "";
  const canManageCase = isAuthenticated && isAdminRole(user?.role);
  const canSubmitSighting =
    isVolunteerRole(user?.role) || Boolean(volunteerDeviceId);

  const loadCase = async () => {
    setLoading(true);
    try {
      const response = await caseService.getCaseById(id);
      setCaseData(response.data);
    } catch {
      toast.error("Unable to load this case.");
    } finally {
      setLoading(false);
    }
  };

  const loadStrategy = async (caseId) => {
    try {
      const response = await api.get(`/search-strategy/${caseId}`);
      setStrategy(response.data.data || null);
    } catch {
      setStrategy(null);
    }
  };

  useEffect(() => {
    loadCase();
  }, [id]);

  useEffect(() => {
    if (caseData?.caseId) {
      loadStrategy(caseData.caseId);
    }
  }, [caseData?.caseId]);

  const mapUrl = useMemo(() => {
    if (!caseData) return "https://www.google.com/maps";
    return buildGoogleMapsUrl(
      getCaseCoordinates(caseData),
      getCaseAddress(caseData),
    );
  }, [caseData]);

  const weatherRisk = caseData?.weatherRisk || caseData?.priority?.weatherRisk;

  const handleGenerateStrategy = async () => {
    if (!caseData?.caseId) return;

    try {
      const response = await api.post(
        `/search-strategy/generate/${caseData.caseId}`,
        {},
      );
      setStrategy(response.data.data || null);
      toast.success("Search strategy generated.");
    } catch {
      toast.error("Unable to generate search strategy.");
    }
  };

  const handleFindMatches = async () => {
    setLoadingMatches(true);
    try {
      const response = await caseService.findMatches(caseData.caseId);
      setMatches(response.data || []);
    } catch {
      toast.error("Unable to load potential matches.");
    } finally {
      setLoadingMatches(false);
    }
  };

  const resolveSightingLocation = async () => {
    if (!sightingForm.address.trim()) {
      toast.error("Add the sighting location first.");
      return;
    }

    setResolvingSightingLocation(true);
    try {
      const resolved = await geocodeLocation(sightingForm.address);
      setResolvedSightingLocation(resolved);
      setSightingForm((current) => ({
        ...current,
        address: resolved.address || current.address,
      }));
      toast.success("Sighting location found on the map.");
    } catch {
      toast.error("Unable to find that sighting location.");
    } finally {
      setResolvingSightingLocation(false);
    }
  };

  const handleSubmitSighting = async (event) => {
    event.preventDefault();
    if (!caseData?.caseId) return;
    if (!sightingForm.address.trim()) {
      toast.error("A sighting location is required.");
      return;
    }

    setSubmittingSighting(true);
    try {
      let locationForSubmit = resolvedSightingLocation;
      if (!locationForSubmit) {
        locationForSubmit = await geocodeLocation(sightingForm.address);
        setResolvedSightingLocation(locationForSubmit);
      }

      await caseService.addSighting(caseData.caseId, {
        location: {
          coordinates: [
            locationForSubmit.longitude,
            locationForSubmit.latitude,
          ],
          address: locationForSubmit.address || sightingForm.address,
        },
        description: sightingForm.description,
        clothing: parseCommaSeparated(sightingForm.clothing),
        confidence: Number(sightingForm.confidence) || 70,
      });

      toast.success("Sighting recorded.");
      setSightingForm(initialSighting);
      setResolvedSightingLocation(null);
      await loadCase();
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Unable to submit the sighting.",
      );
    } finally {
      setSubmittingSighting(false);
    }
  };

  const handleResolve = async (outcome) => {
    if (!caseData?.caseId) return;

    setResolving(true);
    try {
      await caseService.resolveCase(caseData.caseId, {
        outcome,
        notes: `Resolved from case detail on ${new Date().toISOString()}`,
      });
      toast.success("Case status updated.");
      await loadCase();
    } catch {
      toast.error("Unable to update the case status.");
    } finally {
      setResolving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 px-4 py-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-stone-200 bg-white p-10 text-center text-stone-500">
          Loading case details...
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-stone-50 px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-stone-400" />
          <h1 className="mt-4 text-2xl font-semibold text-charcoal">
            Case not found
          </h1>
          <Link
            to="/cases"
            className="mt-6 inline-flex rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-white"
          >
            Return to cases
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            to="/cases"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-terracotta"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all cases
          </Link>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(caseData.priority?.level)}`}
                >
                  {caseData.priority?.level || "UNKNOWN"} priority
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(caseData.status)}`}
                >
                  {(caseData.status || "unknown").replaceAll("_", " ")}
                </span>
              </div>

              <div>
                <h1 className="text-4xl font-semibold text-charcoal">
                  {caseData.person?.name || "Unknown person"}
                </h1>
                <p className="mt-2 text-sm text-stone-500">
                  Case ID: {caseData.caseId}
                </p>
              </div>

              <p className="max-w-3xl text-base leading-7 text-stone-700">
                {getCaseSummary(caseData)}
              </p>

              <div className="flex flex-wrap gap-5 text-sm text-stone-600">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-terracotta" />
                  {getCaseAddress(caseData)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-terracotta" />
                  {formatRelativeTime(getCaseLastSeenAt(caseData))}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 lg:max-w-sm lg:justify-end">
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
              >
                Open Location
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success("Case link copied.");
                }}
                className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              {caseData.status === "active" && canManageCase ? (
                <>
                  <button
                    type="button"
                    disabled={resolving}
                    onClick={() => handleResolve("found_safe")}
                    className="rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                  >
                    Mark Found Safe
                  </button>
                  <button
                    type="button"
                    disabled={resolving}
                    onClick={() => handleResolve("case_closed")}
                    className="rounded-full bg-charcoal px-4 py-3 text-sm font-semibold text-white transition hover:bg-charcoal/90 disabled:opacity-60"
                  >
                    Close Case
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-charcoal">
              Person and case information
            </h2>
            {getCaseImageSource(caseData) ? (
              <img
                src={getCaseImageSource(caseData)}
                alt={caseData.person?.name || "Case"}
                className="mt-5 h-64 w-full rounded-3xl object-cover"
              />
            ) : null}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Age
                </p>
                <p className="mt-2 text-lg font-medium text-charcoal">
                  {caseData.person?.age || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Gender
                </p>
                <p className="mt-2 text-lg font-medium capitalize text-charcoal">
                  {caseData.person?.gender || "Unknown"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Clothing
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-700">
                  {caseData.person?.clothing?.length
                    ? caseData.person.clothing.join(", ")
                    : "No clothing details were provided."}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Description
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-700">
                  {caseData.person?.description ||
                    "No long-form description yet."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-charcoal">
                  Search strategy
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  Generate and review the backend search plan for this case.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerateStrategy}
                className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
              >
                <Target className="h-4 w-4" />
                Generate strategy
              </button>
            </div>

            {strategy ? (
              <div className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-stone-50 p-4">
                    <p className="text-sm text-stone-500">Priority</p>
                    <p className="mt-2 text-lg font-semibold text-charcoal">
                      {strategy.priority || "Operational"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-stone-50 p-4">
                    <p className="text-sm text-stone-500">Zones</p>
                    <p className="mt-2 text-lg font-semibold text-charcoal">
                      {strategy.zones?.length || 0}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-stone-50 p-4">
                    <p className="text-sm text-stone-500">Area type</p>
                    <p className="mt-2 text-lg font-semibold text-charcoal">
                      {strategy.areaType || "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {(strategy.zones || []).slice(0, 5).map((zone) => (
                    <div
                      key={zone.id}
                      className="rounded-2xl border border-stone-200 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-charcoal">
                            {zone.type || "Search zone"}
                          </p>
                          <p className="mt-1 text-sm text-stone-500">
                            {zone.searchMethod || "Manual review"} -{" "}
                            {zone.recommendedSearchers || 0} responders
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-terracotta">
                          {zone.probability?.toFixed?.(1) ||
                            zone.probability ||
                            0}
                          %
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500">
                No saved search strategy yet.
              </div>
            )}
          </div>

          {canManageCase ? (
            <div className="rounded-3xl border border-stone-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-charcoal">
                    Potential matches
                  </h2>
                  <p className="mt-1 text-sm text-stone-500">
                    Run the matching engine against other backend cases.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleFindMatches}
                  disabled={loadingMatches}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta disabled:opacity-60"
                >
                  <Sparkles className="h-4 w-4" />
                  {loadingMatches ? "Checking..." : "Find matches"}
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {matches.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500">
                    No match results loaded yet.
                  </div>
                ) : (
                  matches.map((match) => (
                    <div
                      key={match.caseId}
                      className="rounded-2xl border border-stone-200 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-charcoal">
                            {match.caseId}
                          </p>
                          <p className="mt-1 text-sm text-stone-500">
                            Confidence band: {match.confidence}
                          </p>
                        </div>
                        <Link
                          to={`/cases/${match.caseId}`}
                          className="rounded-full bg-charcoal px-4 py-2 text-sm font-semibold text-white"
                        >
                          Review case
                        </Link>
                      </div>
                      <p className="mt-3 text-sm text-stone-600">
                        Match score: {Math.round((match.score || 0) * 100)}%
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-charcoal">
              Last seen and timeline
            </h2>
            <div className="mt-5 space-y-4 text-sm text-stone-700">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Address
                </p>
                <p className="mt-2">{getCaseAddress(caseData)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Timestamp
                </p>
                <p className="mt-2">
                  {formatDateTime(getCaseLastSeenAt(caseData))}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Coordinates
                </p>
                <p className="mt-2">
                  {getCaseCoordinates(caseData).length === 2
                    ? getCaseCoordinates(caseData).join(", ")
                    : "No map coordinates available"}
                </p>
              </div>
            </div>
          </div>

          {weatherRisk ? (
            <div className="rounded-3xl border border-stone-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-charcoal">
                Weather risk
              </h2>
              <div className="mt-4 space-y-2 text-sm text-stone-700">
                <p>
                  Risk level:{" "}
                  <span className="font-semibold">
                    {weatherRisk.riskLevel || weatherRisk.level || "Unknown"}
                  </span>
                </p>
                {weatherRisk.weather?.description ? (
                  <p>
                    Conditions: {weatherRisk.weather.description} at{" "}
                    {weatherRisk.weather.temp} C
                  </p>
                ) : null}
                {weatherRisk.details?.length ? <p>{weatherRisk.details[0]}</p> : null}
              </div>
            </div>
          ) : null}

          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-charcoal">Sightings</h2>
            <div className="mt-5 space-y-3">
              {(caseData.sightings || []).length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500">
                  No sightings submitted yet.
                </div>
              ) : (
                caseData.sightings.map((sighting, index) => (
                  <div
                    key={`${sighting.timestamp}-${index}`}
                    className="rounded-2xl border border-stone-200 p-4"
                  >
                    <p className="font-semibold text-charcoal">
                      Sighting {index + 1}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      {formatDateTime(sighting.timestamp)}
                    </p>
                    <p className="mt-3 text-sm text-stone-700">
                      {sighting.description || "No details provided."}
                    </p>
                    <p className="mt-2 text-sm text-stone-500">
                      {sighting.location?.address || "No address provided"} -{" "}
                      {sighting.confidence || 0}% confidence
                    </p>
                    <a
                      href={buildGoogleMapsUrl(
                        sighting.location?.coordinates,
                        sighting.location?.address,
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
                    >
                      Open sighting location
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

          {canSubmitSighting ? (
            <form
              onSubmit={handleSubmitSighting}
              className="rounded-3xl border border-stone-200 bg-white p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-charcoal">
                    Submit a sighting
                  </h2>
                  <p className="mt-1 text-sm text-stone-500">
                    Volunteers and admins can submit verified sightings for this
                    case.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resolveSightingLocation}
                  disabled={resolvingSightingLocation}
                  className="rounded-full border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta disabled:opacity-60"
                >
                  {resolvingSightingLocation
                    ? "Finding location..."
                    : "Find sighting on map"}
                </button>
              </div>

              <div className="mt-5 grid gap-4">
                <input
                  value={sightingForm.address}
                  onChange={(event) => {
                    setResolvedSightingLocation(null);
                    setSightingForm((current) => ({
                      ...current,
                      address: event.target.value,
                    }));
                  }}
                  placeholder="Sighting address"
                  className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
                />
                {resolvedSightingLocation ? (
                  <div className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-600">
                    Map location ready: {resolvedSightingLocation.address}
                  </div>
                ) : null}
                <textarea
                  value={sightingForm.description}
                  onChange={(event) =>
                    setSightingForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="What did you see?"
                  className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
                />
                <input
                  value={sightingForm.clothing}
                  onChange={(event) =>
                    setSightingForm((current) => ({
                      ...current,
                      clothing: event.target.value,
                    }))
                  }
                  placeholder="Clothing details, comma separated"
                  className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
                />
                <input
                  value={sightingForm.confidence}
                  onChange={(event) =>
                    setSightingForm((current) => ({
                      ...current,
                      confidence: event.target.value,
                    }))
                  }
                  placeholder="Confidence 0-100"
                  className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
                />
              </div>

              <button
                type="submit"
                disabled={submittingSighting}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white transition hover:bg-clay disabled:opacity-60"
              >
                {submittingSighting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit sighting"
                )}
              </button>
            </form>
          ) : (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-500">
              Sightings can only be submitted by admins or registered volunteers.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MissingCaseDetailPage;
