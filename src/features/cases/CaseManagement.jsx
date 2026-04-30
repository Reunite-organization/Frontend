import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import CaseList from "./CaseList";
import { Badge } from "@/components/ui/badge";

export default function CaseManagement() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1.4fr_0.6fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Case Management
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Active cases and operational flow
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Manage reports, review AI summaries, and keep case status aligned
              with field operations from one control surface.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-900">Workflow</div>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              <li>• Review new reports</li>
              <li>• Monitor case priority</li>
              <li>• Dispatch volunteer teams</li>
              <li>• Close cases when resolved</li>
            </ul>
          </div>
        </div>
      </div>

      <CaseList />
    </div>
  );
}
