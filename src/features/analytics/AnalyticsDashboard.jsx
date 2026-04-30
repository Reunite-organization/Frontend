import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/services/api";
import { BarChart3, Activity, ShieldCheck, Clock } from "lucide-react";

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [dashboardRes, metricsRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/metrics"),
        ]);
        setStats(dashboardRes.data.data);
        setMetrics(metricsRes.data.data);
      } catch (error) {
        console.error("Failed to load analytics", error);
      }
    };
    loadAnalytics();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1.4fr_0.6fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Analytics
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Operational performance
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Monitor response time, volunteer readiness, and case outcomes in
              one operational dashboard.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <BarChart3 className="w-4 h-4" />
              Data-driven decisions
            </div>
            <div className="mt-3 text-sm text-slate-600">
              This view helps coordinators know whether the system is keeping
              pace with field conditions.
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Response time
            </div>
            <div className="mt-2 text-3xl font-semibold text-slate-900">
              {stats?.avgResponseTime ?? "—"} min
            </div>
            <div className="mt-2 text-sm text-slate-600">
              Average time from report to first alert
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Success rate
            </div>
            <div className="mt-2 text-3xl font-semibold text-slate-900">
              {stats?.successRate ?? "—"}%
            </div>
            <div className="mt-2 text-sm text-slate-600">
              Resolved vs reported cases
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Volunteers online
            </div>
            <div className="mt-2 text-3xl font-semibold text-slate-900">
              {stats?.onlineVolunteers ?? "—"}
            </div>
            <div className="mt-2 text-sm text-slate-600">
              Volunteers available in the last 15 minutes
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
              AI confidence
            </div>
            <div className="mt-2 text-3xl font-semibold text-slate-900">
              {stats?.aiConfidence ?? "—"}%
            </div>
            <div className="mt-2 text-sm text-slate-600">
              AI extraction accuracy and trust signal
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardContent>
            <div className="text-sm font-semibold text-slate-900">
              Recent operational metrics
            </div>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-600">
                  Total searches in the last 24h
                </div>
                <div className="mt-2 text-xl font-semibold text-slate-900">
                  {stats?.totalSearches ?? "—"}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-600">
                  Volunteer hours logged
                </div>
                <div className="mt-2 text-xl font-semibold text-slate-900">
                  {stats?.volunteerHours ?? "—"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm font-semibold text-slate-900">
              Security and trust
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Metrics include privacy and alert handling health.</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>
                  Monitoring ensures the platform stays operational under load.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
