import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, RefreshCw, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import api from "../services/api";
import { caseService } from "../services/caseService";
import integrationService from "../services/integrationService";
import { formatRelativeTime, getCaseAddress } from "../lib/caseFormatting";
import { wantedApi } from "../features/wanted/services/wantedApi";

const defaultBroadcast = {
  platform: "all",
  message: "",
  caseId: "",
  tags: "",
};

export const AdminControlPage = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activeCases, setActiveCases] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [monitoring, setMonitoring] = useState(null);
  const [schoolStats, setSchoolStats] = useState(null);
  const [broadcastStats, setBroadcastStats] = useState(null);
  const [scraperStatus, setScraperStatus] = useState(null);
  const [predictionPreview, setPredictionPreview] = useState(null);
  const [broadcastForm, setBroadcastForm] = useState(defaultBroadcast);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [wantedPosts, setWantedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [broadcasting, setBroadcasting] = useState(false);
  const [runningScrape, setRunningScrape] = useState(false);
  const [updatingWantedPostId, setUpdatingWantedPostId] = useState(null);

  const integrationCards = useMemo(
    () => [
      {
        label: "Supported languages",
        value: languages.join(", ") || "Unavailable",
      },
      {
        label: "Monitoring health",
        value: monitoring?.overall || monitoring?.status || "Unknown",
      },
      {
        label: "School networks",
        value: schoolStats?.totalNetworks ?? 0,
      },
      {
        label: "Prediction preview",
        value: predictionPreview
          ? `${predictionPreview.prediction} (${predictionPreview.score}/100)`
          : "Unavailable",
      },
    ],
    [languages, monitoring, predictionPreview, schoolStats],
  );

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsRes, analyticsRes, casesRes, languagesRes, monitoringRes, schoolRes, broadcastRes, scraperRes, wantedPostsRes] =
        await Promise.allSettled([
          api.get("/dashboard/stats"),
          api.get("/dashboard/analytics", { params: { range: "24h" } }),
          caseService.getAllCases({ status: "active", limit: 8 }),
          integrationService.getSupportedLanguages(),
          integrationService.getMonitoringHealth(),
          integrationService.getSchoolNetworkStats(),
          api.get("/broadcast/stats"),
          api.get("/scrape/status"),
          wantedApi.getPosts({ limit: 6 }),
        ]);

      const casesData =
        casesRes.status === "fulfilled" ? casesRes.value.data || [] : [];

      setStats(statsRes.status === "fulfilled" ? statsRes.value.data.data : null);
      setAnalytics(
        analyticsRes.status === "fulfilled" ? analyticsRes.value.data.data : null,
      );
      setActiveCases(casesData);
      setLanguages(
        languagesRes.status === "fulfilled"
          ? (languagesRes.value.data?.supported || []).map((item) => item.code)
          : [],
      );
      setMonitoring(
        monitoringRes.status === "fulfilled" ? monitoringRes.value.data : null,
      );
      setSchoolStats(
        schoolRes.status === "fulfilled" ? schoolRes.value.data : null,
      );
      setBroadcastStats(
        broadcastRes.status === "fulfilled" ? broadcastRes.value.data : null,
      );
      setScraperStatus(
        scraperRes.status === "fulfilled" ? scraperRes.value.data.data : null,
      );
      setWantedPosts(
        wantedPostsRes.status === "fulfilled" ? wantedPostsRes.value.data || [] : [],
      );

      if (casesData.length > 0) {
        try {
          const prediction = await integrationService.predictCaseOutcome(
            casesData[0],
          );
          setPredictionPreview(prediction.data || null);
        } catch {
          setPredictionPreview(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      await loadDashboard();
    };

    bootstrap();
  }, []);

  const handleBroadcast = async (event) => {
    event.preventDefault();
    setBroadcasting(true);
    try {
      await api.post("/broadcast/broadcast", {
        platform: broadcastForm.platform,
        message: broadcastForm.message,
        caseId: broadcastForm.caseId || undefined,
        tags: broadcastForm.tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });
      toast.success("Broadcast sent.");
      setBroadcastForm(defaultBroadcast);
      await loadDashboard();
    } catch {
      toast.error("Unable to send broadcast.");
    } finally {
      setBroadcasting(false);
    }
  };

  const handleRunScrape = async () => {
    setRunningScrape(true);
    try {
      const response = await api.post("/scrape/all");
      const created = response.data?.data?.casesCreated ?? 0;
      toast.success(`Scrape finished. ${created} case(s) created.`);
      await loadDashboard();
    } catch {
      toast.error("Unable to run the scraper.");
    } finally {
      setRunningScrape(false);
    }
  };

  const handleScrapeUrl = async (event) => {
    event.preventDefault();
    if (!scrapeUrl.trim()) {
      toast.error("Add a URL to scrape.");
      return;
    }

    setRunningScrape(true);
    try {
      await api.post("/scrape/url", { url: scrapeUrl.trim() });
      toast.success("URL sent to the scraper.");
      setScrapeUrl("");
      await loadDashboard();
    } catch {
      toast.error("Unable to scrape that URL.");
    } finally {
      setRunningScrape(false);
    }
  };

  const handleMarkWantedReconnected = async (postId) => {
    setUpdatingWantedPostId(postId);
    try {
      await wantedApi.markReconnected(postId);
      toast.success("Reconnect post marked as reconnected.");
      await loadDashboard();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to close that reconnect post.",
      );
    } finally {
      setUpdatingWantedPostId(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-terracotta">
                Admin Control
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-charcoal">
                Command center for missing-person response and system operations
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-stone">
                This page pulls together dashboard, analytics, monitoring,
                school network, prediction, broadcast, and scraping endpoints so
                admin workflows stay aligned to the backend.
              </p>
            </div>
            <button
              type="button"
              onClick={loadDashboard}
              className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh control data
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Active cases",
              value: stats?.activeCases ?? "—",
            },
            {
              label: "Volunteers online",
              value: stats?.onlineVolunteers ?? "—",
            },
            {
              label: "Success rate",
              value:
                stats?.successRate !== undefined ? `${stats.successRate}%` : "—",
            },
            {
              label: "Response time",
              value:
                stats?.avgResponseTime !== undefined
                  ? `${stats.avgResponseTime} min`
                  : "—",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-stone-200 bg-white p-6"
            >
              <p className="text-sm text-stone-500">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-charcoal">
                {loading ? "..." : item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-stone-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-charcoal">
                Active case queue
              </h2>
              <div className="mt-5 space-y-4">
                {activeCases.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500">
                    No active cases loaded.
                  </div>
                ) : (
                  activeCases.map((caseItem) => (
                    <div
                      key={caseItem.caseId}
                      className="rounded-2xl border border-stone-200 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-charcoal">
                            {caseItem.person?.name || "Unknown person"}
                          </p>
                          <p className="mt-1 text-sm text-stone-500">
                            {caseItem.caseId} • {getCaseAddress(caseItem)}
                          </p>
                        </div>
                        <a
                          href={`/cases/${caseItem.caseId}`}
                          className="rounded-full bg-charcoal px-4 py-2 text-sm font-semibold text-white"
                        >
                          Review
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-charcoal">
                    Reconnect operations
                  </h2>
                  <p className="mt-1 text-sm text-stone-500">
                    Close active reconnect posts when the people involved confirm
                    they have found each other.
                  </p>
                </div>
                <a
                  href="/wanted"
                  className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
                >
                  Open reconnect hub
                </a>
              </div>

              <div className="mt-5 space-y-4">
                {wantedPosts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500">
                    No active reconnect posts loaded.
                  </div>
                ) : (
                  wantedPosts.map((post) => (
                    <div
                      key={post._id}
                      className="rounded-2xl border border-stone-200 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-charcoal">
                            {post.personDetails?.personName || "Unknown person"}
                          </p>
                          <p className="mt-1 text-sm text-stone-500">
                            {[post.city, post.country].filter(Boolean).join(", ")}
                            {post.year ? ` • ${post.year}` : ""}
                          </p>
                          <p className="mt-2 line-clamp-2 text-sm text-stone-600">
                            {post.memoryText?.en || post.memoryText?.am || ""}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={`/wanted/post/${post._id}`}
                            className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
                          >
                            Review post
                          </a>
                          <button
                            type="button"
                            onClick={() => handleMarkWantedReconnected(post._id)}
                            disabled={updatingWantedPostId === post._id}
                            className="inline-flex items-center gap-2 rounded-full bg-success px-4 py-2 text-sm font-semibold text-white transition hover:bg-success/90 disabled:opacity-60"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            {updatingWantedPostId === post._id
                              ? "Closing..."
                              : "Mark reconnected"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-charcoal">
                  Broadcast control
                </h2>
                <p className="text-sm text-stone-500">
                  Recipients:{" "}
                  {broadcastStats?.recipients?.totalRecipients ??
                    broadcastStats?.recipients?.total ??
                    0}
                </p>
              </div>

              <form onSubmit={handleBroadcast} className="mt-5 grid gap-4">
                <select
                  value={broadcastForm.platform}
                  onChange={(event) =>
                    setBroadcastForm((current) => ({
                      ...current,
                      platform: event.target.value,
                    }))
                  }
                  className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
                >
                  <option value="all">All platforms</option>
                  <option value="sms">SMS</option>
                  <option value="telegram">Telegram</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
                <input
                  value={broadcastForm.caseId}
                  onChange={(event) =>
                    setBroadcastForm((current) => ({
                      ...current,
                      caseId: event.target.value,
                    }))
                  }
                  placeholder="Case ID (optional)"
                  className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
                />
                <input
                  value={broadcastForm.tags}
                  onChange={(event) =>
                    setBroadcastForm((current) => ({
                      ...current,
                      tags: event.target.value,
                    }))
                  }
                  placeholder="Recipient tags, comma separated"
                  className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
                />
                <textarea
                  value={broadcastForm.message}
                  onChange={(event) =>
                    setBroadcastForm((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Broadcast message"
                  className="rounded-3xl border border-stone-200 px-4 py-4 text-sm outline-none focus:border-terracotta"
                />
                <button
                  type="submit"
                  disabled={broadcasting}
                  className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white transition hover:bg-clay disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {broadcasting ? "Sending..." : "Send broadcast"}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-stone-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-charcoal">
                Integration and AI readiness
              </h2>
              <div className="mt-5 grid gap-3">
                {integrationCards.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-stone-50 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-charcoal">
                      {loading ? "..." : item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-charcoal">
                  Social scraping
                </h2>
                <button
                  type="button"
                  onClick={handleRunScrape}
                  disabled={runningScrape}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta disabled:opacity-60"
                >
                  <Sparkles className="h-4 w-4" />
                  Run full scrape
                </button>
              </div>

              <div className="mt-5 rounded-2xl bg-stone-50 p-4 text-sm text-stone-700">
                <p>
                  Last status:{" "}
                  <span className="font-semibold">
                    {scraperStatus?.isRunning ? "Running" : "Idle"}
                  </span>
                </p>
                <p className="mt-2">
                  Scraped count: {scraperStatus?.scrapedCount ?? 0}
                </p>
              </div>

              <form onSubmit={handleScrapeUrl} className="mt-4 grid gap-3">
                <input
                  value={scrapeUrl}
                  onChange={(event) => setScrapeUrl(event.target.value)}
                  placeholder="Paste a public URL to scrape"
                  className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-terracotta"
                />
                <button
                  type="submit"
                  disabled={runningScrape}
                  className="rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-white transition hover:bg-charcoal/90 disabled:opacity-60"
                >
                  Submit URL to scraper
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-charcoal">
                Recent backend activity
              </h2>
              <div className="mt-5 space-y-3">
                {(analytics?.activities || []).length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500">
                    No analytics activity loaded.
                  </div>
                ) : (
                  analytics.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="rounded-2xl border border-stone-200 p-4"
                    >
                      <p className="font-semibold text-charcoal">
                        {activity.title}
                      </p>
                      <p className="mt-1 text-sm text-stone-600">
                        {activity.description}
                      </p>
                      <p className="mt-2 text-xs text-stone-500">
                        {activity.time
                          ? activity.time
                          : formatRelativeTime(activity.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminControlPage;
