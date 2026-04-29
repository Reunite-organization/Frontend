import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, MapPin, Navigation, Sparkles } from "lucide-react";
import AddisMap from "@/components/map/AddisMap";
import ReportSightingModal from "@/components/map/ReportSightingModal";
import { sampleLocations } from "@/components/map/mapData";

const REPORTED_SIGHTINGS_STORAGE_KEY = "reported-sightings";

export default function Map() {
  const [locations, setLocations] = useState(sampleLocations);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeMarkerId, setActiveMarkerId] = useState(null);
  const [reportLocation, setReportLocation] = useState(null);

  useEffect(() => {
    const storedSightings = window.localStorage.getItem(
      REPORTED_SIGHTINGS_STORAGE_KEY,
    );

    if (!storedSightings) return;

    try {
      const parsedSightings = JSON.parse(storedSightings);
      if (!Array.isArray(parsedSightings)) return;

      setLocations([...parsedSightings, ...sampleLocations]);
    } catch (error) {
      console.error("Failed to load reported sightings", error);
    }
  }, []);

  useEffect(() => {
    const reportedSightings = locations.filter((location) =>
      String(location.caseId).startsWith("sighting-"),
    );

    window.localStorage.setItem(
      REPORTED_SIGHTINGS_STORAGE_KEY,
      JSON.stringify(reportedSightings),
    );
  }, [locations]);

  const defaultLocation = reportLocation || {
    lat: locations[0]?.lat || 9.03,
    lng: locations[0]?.lng || 38.74,
  };

  const mapStats = [
    { label: "Coverage", value: "Ethiopia" },
    { label: "Default Lat", value: "9.03" },
    { label: "Default Lng", value: "38.74" },
    { label: "Markers", value: String(locations.length) },
  ];

  const handleReportSighting = (payload) => {
    const sightingId = `sighting-${Date.now()}`;
    setActiveMarkerId(sightingId);

    setLocations((current) => [
      {
        caseId: sightingId,
        lat: payload.location.lat,
        lng: payload.location.lng,
        name: payload.name,
        age: "Unknown",
        city: "Reported Sighting",
        status: "Active",
        lastSeen: `${payload.location.lat.toFixed(4)}, ${payload.location.lng.toFixed(4)}`,
        sightingsCount: 1,
        avatarTone: "from-[#2563eb] to-[#60a5fa]",
        description: payload.description,
      },
      ...current,
    ]);
  };

  const handleOpenReportModal = (location = null) => {
    setReportLocation(location);
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setReportLocation(null);
  };

  return (
    <section className="relative h-screen overflow-hidden bg-[#f4efe6]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,165,74,0.22),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(91,140,111,0.18),_transparent_28%),linear-gradient(180deg,_rgba(253,251,247,0.55),_rgba(253,251,247,0))]" />

      <div className="relative grid h-full w-full lg:grid-cols-[380px_1fr]">
        <aside className="z-[500] flex flex-col justify-between border-b border-white/50 bg-[#fdfbf7]/92 p-5 backdrop-blur-xl lg:border-b-0 lg:border-r">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d9cdc0] bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7b6f63]">
                <Sparkles className="h-3.5 w-3.5 text-terracotta" />
                City Map
              </span>

              <div className="space-y-3">
                <h1 className="max-w-sm text-4xl leading-none font-display text-charcoal sm:text-5xl">
                  Addis Ababa at a glance.
                </h1>
                <p className="max-w-md text-sm leading-6 text-stone-600">
                  A focused React Leaflet view centered on Ethiopia&apos;s
                  capital, built as a clean full-screen map experience.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {mapStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-[#e8dfd3] bg-white/85 p-4 shadow-[0_16px_40px_rgba(44,40,37,0.06)]"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-charcoal">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href="https://www.google.com/maps?q=9.03,38.74"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white transition hover:bg-clay"
            >
              <Navigation className="h-4 w-4" />
              Open in Google Maps
            </a>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d4c7ba] bg-white px-5 py-3 text-sm font-semibold text-charcoal transition hover:bg-stone-50"
            >
              <MapPin className="h-4 w-4 text-terracotta" />
              Back to Home
            </Link>
          </div>
        </aside>

        <div className="relative min-h-[50vh] lg:min-h-screen">
          <div className="absolute left-4 right-4 top-4 z-[500] rounded-[28px] border border-white/60 bg-[#fdfbf7]/85 p-4 shadow-[0_20px_60px_rgba(44,40,37,0.14)] backdrop-blur-xl sm:left-6 sm:right-auto sm:w-[320px]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              Live Focus
            </p>
            <h2 className="mt-2 text-2xl font-display text-charcoal">
              Central Addis
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Full-screen responsive map with a simple city highlight and clean
              Leaflet overlays.
            </p>
            <p className="mt-2 text-xs leading-5 text-stone-500">
              Click anywhere on the map to prefill coordinates for a new
              sighting.
            </p>
            <button
              type="button"
              onClick={() => handleOpenReportModal()}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-4 py-3 text-sm font-semibold text-white transition hover:bg-clay sm:w-auto"
            >
              <Eye className="h-4 w-4" />
              Report Sighting
            </button>
          </div>

          <AddisMap
            locations={locations}
            activeMarkerId={activeMarkerId}
            onMapClick={handleOpenReportModal}
          />
        </div>
      </div>

      <ReportSightingModal
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        defaultLocation={defaultLocation}
        onSubmit={handleReportSighting}
      />
    </section>
  );
}
