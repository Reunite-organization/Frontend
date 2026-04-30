import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/services/api";
import { Users, School2, ShieldCheck } from "lucide-react";

export default function NetworkHub() {
  const [networks, setNetworks] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadNetworks = async () => {
      try {
        const [listRes, statsRes] = await Promise.all([
          api.get("/school-networks"),
          api.get("/school-networks/stats"),
        ]);
        setNetworks(listRes.data.data || []);
        setStats(statsRes.data.data || null);
      } catch (error) {
        console.error("Failed to load school networks", error);
      }
    };

    loadNetworks();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1.4fr_0.6fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Network Hub
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              School networks and volunteer coverage
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Track active school networks, their coverage areas, and the
              community resources engaged in supporting a missing person
              response.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <School2 className="w-4 h-4" />
              Network health
            </div>
            <div className="mt-3 text-sm text-slate-600">
              School networks provide critical local intelligence and volunteer
              mobilization at scale.
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Coverage snapshot
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Active school networks
                </h3>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {stats?.totalNetworks || 0}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">
                  Local coverage
                </div>
                <div className="mt-2 text-3xl font-semibold text-slate-900">
                  {stats?.coveragePoints || 0}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">
                  Volunteers active
                </div>
                <div className="mt-2 text-3xl font-semibold text-slate-900">
                  {stats?.activeVolunteers || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <Users className="w-4 h-4" />
              Local activation
            </div>
            <p className="text-sm text-slate-600">
              Networks are indexed by reach, participation, and active case
              support. This panel puts network readiness next to case
              operations.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <div className="text-sm font-semibold text-slate-900">
            Registered Networks
          </div>
          <div className="mt-4 space-y-3">
            {networks.length === 0 ? (
              <div className="text-sm text-slate-500">
                No school networks registered yet.
              </div>
            ) : (
              networks.map((network) => (
                <div
                  key={network._id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-base font-semibold text-slate-900">
                        {network.name}
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        {network.location?.address || "Unknown region"}
                      </div>
                    </div>
                    <Badge className="bg-slate-200 text-slate-700">
                      {network.status || "active"}
                    </Badge>
                  </div>
                  <div className="mt-3 text-sm text-slate-600">
                    {network.description || "No additional details available."}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
