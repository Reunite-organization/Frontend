import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertTriangle, Compass, Sparkles } from "lucide-react";
import DualMapView from "./DualMapView";

export default function IntelligenceMap() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <Card>
          <CardContent className="space-y-4">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Intelligence Map
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Contextual search coordination
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              This map is not a static visual. It becomes the operational ground
              truth by showing active cases, predicted search zones, reported
              sightings, and priority alerts in context.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">
                  What it shows
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>• Active case locations and last seen points</li>
                  <li>• Real-time sighting updates</li>
                  <li>• Predicted movement trails</li>
                  <li>• Nearby responder coverage</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">
                  Why it matters
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  The map helps teams answer: where should I look first, where
                  have others already searched, and how should I shift resources
                  when new information arrives.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Map Mode
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Active operations
                  </h3>
                </div>
                <Badge className="bg-slate-100 text-slate-700">
                  Contextual
                </Badge>
              </div>
              <div className="text-sm text-slate-600">
                Switch between case context, volunteer coverage, and nearby
                alerts to keep operational focus aligned with mission priority.
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-slate-800">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">Live value</span>
              </div>
              <p className="text-sm text-slate-600">
                Every location on the map is tied to a case workflow, a reported
                sighting, or a priority alert. The map is the operational layer,
                not the homepage.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <DualMapView />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Search Guidance
          </div>
          <div className="mt-3 text-sm text-slate-700">
            When a new report is created, the map automatically anchors search
            zones to the last known location and adjusts for weather, time, and
            nearby responders.
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Alerts
          </div>
          <div className="mt-3 text-sm text-slate-700">
            Red markers are high-priority cases. Orange markers show cases that
            need rapid volunteer response. Pulse means active alerts are still
            unresolved.
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Intelligent support
          </div>
          <div className="mt-3 text-sm text-slate-700">
            The map surface is also the interface for quick sightings, volunteer
            check-ins, and AI-generated routing suggestions.
          </div>
        </div>
      </div>
    </div>
  );
}
