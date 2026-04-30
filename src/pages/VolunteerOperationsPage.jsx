import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Navigation, Radio, Send } from "lucide-react";
import { toast } from "sonner";
import api from "../services/api";
import { caseService } from "../services/caseService";
import { useAuth } from "../hooks/useAuth";
import {
  buildGoogleMapsUrl,
  formatRelativeTime,
  getCaseAddress,
  getCaseLastSeenAt,
  getCaseSummary,
  getPriorityClasses,
} from "../lib/caseFormatting";

const getStoredVolunteerId = () => {
  const existing = localStorage.getItem("reunite-volunteer-device-id");
  if (existing) return existing;

  const generated =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `volunteer-${Date.now()}`;

  localStorage.setItem("reunite-volunteer-device-id", generated);
  return generated;
};

export const VolunteerOperationsPage = () => {
  const { user } = useAuth();
  const [volunteer, setVolunteer] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    deviceId: getStoredVolunteerId(),
  });
  const [location, setLocation] = useState(null);
  const [nearbyCases, setNearbyCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [quickForm, setQuickForm] = useState({
    description: "",
    address: "",
    confidence: "",
    clothing: "",
    caseId: "",
  });
  const [sendingSighting, setSendingSighting] = useState(false);
  const [sendingSMSCaseId, setSendingSMSCaseId] = useState(null);

  useEffect(() => {
    setVolunteer((current) => ({
      ...current,
      name: user?.name || current.name,
      phone: user?.phone || current.phone,
    }));
  }, [user]);

  const readiness = useMemo(
    () => [
    {
        label: "Location status",
        value: location ? "Captured" : "Waiting",
      },
      {
        label: "Nearby cases",
        value: nearbyCases.length,
      },
    ],
    [location, nearbyCases.length, volunteer.deviceId],
  );

  const loadNearbyCases = async (coords) => {
    if (!coords) return;

    setLoadingCases(true);
    try {
      const response = await caseService.getNearbyCases(
        coords.latitude,
        coords.longitude,
        5000,
      );
      setNearbyCases(response.data || []);
    } catch (error) {
      toast.error("Unable to load nearby cases.");
    } finally {
      setLoadingCases(false);
    }
  };

  useEffect(() => {
    if (location) {
      loadNearbyCases(location);
    }
  }, [location]);

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);
        toast.success("Volunteer location captured.");
      },
      () => toast.error("Unable to capture your location."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setRegistering(true);

    try {
      const response = await api.post("/volunteers/register", volunteer);
      if (response.data?.success) {
        toast.success("Volunteer record registered.");
      } else {
        toast.success("Volunteer intake sent.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Unable to register volunteer right now.",
      );
    } finally {
      setRegistering(false);
    }
  };

  const handleQuickSighting = async (event) => {
    event.preventDefault();
    if (!location) {
      toast.error("Capture your location before sending a quick sighting.");
      return;
    }

    setSendingSighting(true);
    try {
      const response = await caseService.quickSighting({
        location: {
          lat: location.latitude,
          lng: location.longitude,
          address: quickForm.address || undefined,
        },
        caseId: quickForm.caseId || undefined,
        description: quickForm.description,
        confidence: Number(quickForm.confidence) || 60,
        clothing: quickForm.clothing
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setQuickForm({
        description: "",
        address: "",
        confidence: 60,
        clothing: "",
        caseId: "",
      });
      toast.success(
        response?.caseId
          ? `Quick sighting submitted for ${response.caseId}.`
          : "Quick sighting submitted.",
      );
      await loadNearbyCases(location);
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Unable to send the quick sighting.",
      );
    } finally {
      setSendingSighting(false);
    }
  };

  const handleSendSMSUpdate = async (caseId) => {
    setSendingSMSCaseId(caseId);
    try {
      await caseService.sendSMSUpdate(caseId, {
        message:
          "Volunteer update: possible sighting reported near this case. Please review case timeline.",
      });
      toast.success(`SMS update sent for ${caseId}.`);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Unable to send SMS update.");
    } finally {
      setSendingSMSCaseId(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl p-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-terracotta">
            Volunteer Response
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-charcoal">
            Register volunteers, capture field location, and report nearby sightings
          </h1>
          <p className="mt-2 max-w-3xl text-base leading-7 text-stone">
            This page is focused on the missing-person backend. It supports
            volunteer intake, location-based nearby case lookup, and the quick
            sighting endpoint for field response.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/cases"
              className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
            >
              Back to cases
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="space-y-6">
          <form
            onSubmit={handleRegister}
            className="rounded-3xl border border-stone-200 bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-charcoal">
              Volunteer intake
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Sends a registration payload to the backend volunteer route.
            </p>

            <div className="mt-5 space-y-3">
              <input
                value={volunteer.name}
                onChange={(event) =>
                  setVolunteer((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Volunteer name"
                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
              />
              <input
                value={volunteer.phone}
                onChange={(event) =>
                  setVolunteer((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                placeholder="Volunteer phone"
                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
              />
            </div>

            <button
              type="submit"
              disabled={registering}
              className="mt-5 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white transition hover:bg-clay disabled:opacity-60"
            >
              {registering ? "Registering..." : "Register volunteer"}
            </button>
          </form>

          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-charcoal">
                  Field readiness
                </h2>
                <p className="mt-2 text-sm text-stone-500">
                  Capture location to pull nearby active cases from the backend.
                </p>
              </div>
              <button
                type="button"
                onClick={captureLocation}
                className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
              >
                <Navigation className="h-4 w-4" />
                Capture location
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              {readiness.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-stone-50 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    {item.label}
                  </p>
                  <p className="mt-2 break-all text-sm font-semibold text-charcoal">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleQuickSighting}
            className="rounded-3xl border border-stone-200 bg-white p-6"
          >
            <h2 className="text-xl font-semibold text-charcoal">
              Quick sighting
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Sends a full quick sighting payload (location, confidence, clothing,
              optional target case) into the backend quick flow.
            </p>
            <select
              value={quickForm.caseId}
              onChange={(event) =>
                setQuickForm((current) => ({
                  ...current,
                  caseId: event.target.value,
                }))
              }
              className="mt-5 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
            >
              <option value="">Auto-match nearest case</option>
              {nearbyCases.map((caseItem) => (
                <option key={caseItem.caseId} value={caseItem.caseId}>
                  {caseItem.caseId} - {caseItem.person?.name || "Unknown"}
                </option>
              ))}
            </select>
            <input
              value={quickForm.address}
              onChange={(event) =>
                setQuickForm((current) => ({
                  ...current,
                  address: event.target.value,
                }))
              }
              placeholder="Address or landmark (optional)"
              className="mt-4 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
            />
            <textarea
              value={quickForm.description}
              onChange={(event) =>
                setQuickForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={4}
              placeholder="What did you just see?"
              className="mt-5 w-full rounded-3xl border border-stone-200 px-4 py-4 text-sm outline-none focus:border-terracotta"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={quickForm.confidence}
              onChange={(event) =>
                setQuickForm((current) => ({
                  ...current,
                  confidence: event.target.value,
                }))
              }
              placeholder="Confidence (0-100)"
              className="mt-4 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
            />
            <input
              value={quickForm.clothing}
              onChange={(event) =>
                setQuickForm((current) => ({
                  ...current,
                  clothing: event.target.value,
                }))
              }
              placeholder="Clothing details, comma separated"
              className="mt-4 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
            />
            <button
              type="submit"
              disabled={sendingSighting || !quickForm.description.trim()}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-white transition hover:bg-charcoal/90 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {sendingSighting ? "Sending..." : "Submit quick sighting"}
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-charcoal">
                Nearby active cases
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                Cases loaded from the nearby case endpoint.
              </p>
            </div>
            {loadingCases ? (
              <span className="text-sm text-stone-500">Loading...</span>
            ) : null}
          </div>

          <div className="mt-5 space-y-4">
            {nearbyCases.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-sm text-stone-500">
                Capture location to check for nearby active cases.
              </div>
            ) : (
              nearbyCases.map((caseItem) => (
                <div
                  key={caseItem.caseId}
                  className="rounded-2xl border border-stone-200 p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(caseItem.priority?.level)}`}
                    >
                      {caseItem.priority?.level || "UNKNOWN"} priority
                    </span>
                    <span className="text-xs text-stone-500">
                      {formatRelativeTime(getCaseLastSeenAt(caseItem))}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-charcoal">
                    {caseItem.person?.name || "Unknown person"}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-stone-700">
                    {getCaseSummary(caseItem)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-600">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-terracotta" />
                      {getCaseAddress(caseItem)}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Radio className="h-4 w-4 text-terracotta" />
                      {caseItem.sightings?.length || 0} sightings
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={buildGoogleMapsUrl(
                        caseItem.lastSeen?.location?.coordinates,
                        getCaseAddress(caseItem),
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
                    >
                      Open location
                    </a>
                    <a
                      href={`/cases/${caseItem.caseId}`}
                      className="rounded-full bg-charcoal px-4 py-2 text-sm font-semibold text-white"
                    >
                      Review case
                    </a>
                    <button
                      type="button"
                      onClick={() => handleSendSMSUpdate(caseItem.caseId)}
                      disabled={sendingSMSCaseId === caseItem.caseId}
                      className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta disabled:opacity-60"
                    >
                      {sendingSMSCaseId === caseItem.caseId
                        ? "Sending SMS..."
                        : "Send SMS update"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VolunteerOperationsPage;
