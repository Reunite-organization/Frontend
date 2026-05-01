import React from "react";
import { motion } from "framer-motion";
import MapView from "@/features/map/MapView";

export default function Map() {
  return (
    <div className="min-h-screen bg-white dark:from-black dark:via-orange-950/20 dark:to-black dark:bg-gradient-to-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Search Map
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Explore case locations and report sightings directly from the map.
          </p>
        </motion.div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <MapView />
        </div>
      </div>
    </div>
  );
}
