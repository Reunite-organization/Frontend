import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Heart,
} from "lucide-react";
import { caseService } from "@/services/caseService";

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const response = await caseService.getAllCases();
      setCases(response.data || []);
    } catch (error) {
      console.error("Failed to load cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch =
      caseItem.missingPerson?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      caseItem.caseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.lastSeen?.address
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || caseItem.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400" />;
      case "resolved":
        return <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400" />;
      case "investigating":
        return <Clock className="h-6 w-6 text-orange-500 dark:text-orange-400" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500 dark:text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-red-100 dark:bg-red-600 text-red-800 dark:text-white border-2 border-red-300 dark:border-red-400";
      case "resolved":
        return "bg-green-100 dark:bg-green-600 text-green-800 dark:text-white border-2 border-green-300 dark:border-green-400";
      case "investigating":
        return "bg-orange-100 dark:bg-orange-600 text-orange-800 dark:text-white border-2 border-orange-300 dark:border-orange-400";
      default:
        return "bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:from-black dark:via-orange-950/20 dark:to-black dark:bg-gradient-to-b flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-stone-300 font-semibold">Loading cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className= " bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              Missing Persons Cases
            </h1>
            <Link
              to="/report"
              className="bg-white text-red-600 px-8 py-4 rounded-full hover:bg-red-50 transition-all font-bold text-base shadow-2xl hover:shadow-3xl hover:scale-105 transform whitespace-nowrap flex items-center gap-2"
            >
              <AlertCircle className="h-5 w-5" />
              Report Missing Person
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emotional Context Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-600 dark:to-red-600 border-l-4 border-orange-500 dark:border-orange-200 rounded-xl p-6 mb-8 shadow-lg"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-orange-600 dark:text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                ⏰ Time is Critical
              </h3>
              <p className="text-gray-700 dark:text-white text-sm leading-relaxed font-medium">
                The first 48 hours are crucial in missing person cases. Your awareness and action can make the difference between a family reunited and a case gone cold. If you have any information about these individuals, please contact authorities immediately.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-orange-950/20 p-6 mb-8 border-2 border-stone-200 dark:border-gray-600"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-white" />
                <input
                  type="text"
                  placeholder="Search by name, case ID, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 dark:border-gray-500 rounded-xl focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-300 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 font-medium text-base"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="h-5 w-5 text-gray-400 dark:text-white" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-5 py-4 border-2 border-gray-300 dark:border-gray-500 rounded-xl focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-300 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bold text-base cursor-pointer min-w-[200px]"
              >
                <option value="all" className="font-bold bg-white dark:bg-gray-700 dark:text-white">📋 All Status</option>
                <option value="active" className="font-bold bg-white dark:bg-gray-700 dark:text-white">🔴 High Priority</option>
                <option value="investigating" className="font-bold bg-white dark:bg-gray-700 dark:text-white">🟠 Active</option>
                <option value="resolved" className="font-bold bg-white dark:bg-gray-700 dark:text-white">🟢 Resolved</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Cases Grid */}
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              Active Cases ({filteredCases.length})
            </h2>
            <p className="text-sm text-gray-600 dark:text-white font-semibold flex items-center gap-1">
              <span className="inline-block h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
              Updated in real-time
            </p>
          </div>

          {filteredCases.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
            >
              <AlertCircle className="h-16 w-16 text-gray-400 dark:text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No cases found
              </h3>
              <p className="text-gray-600 dark:text-gray-200 font-medium">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No missing person cases have been reported yet"}
              </p>
            </motion.div>
          ) : (
            filteredCases.map((caseItem, index) => (
              <motion.div
                key={caseItem.caseId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-orange-950/30 p-8 hover:shadow-2xl dark:hover:shadow-orange-950/50 transition-all duration-300 border-l-[6px] border-orange-500 dark:border-orange-400 hover:border-red-500 dark:hover:border-red-400"
              >
                <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                  <div className="flex items-start space-x-5 flex-1 w-full">
                    {/* Status Icon with Pulse Animation */}
                    <div className="flex-shrink-0 relative">
                      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                        {getStatusIcon(caseItem.status)}
                      </div>
                      {caseItem.status === "active" && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header with Name and Status */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {caseItem.missingPerson?.name || "Unknown Name"}
                        </h3>
                        <span
                          className={`inline-flex px-4 py-2 text-sm font-black rounded-full ${getStatusColor(caseItem.status)} uppercase tracking-wide shadow-md`}
                        >
                          {caseItem.status === "active" ? "🔴 URGENT" : caseItem.status === "investigating" ? "🟠 ACTIVE" : "🟢 RESOLVED"}
                        </span>
                      </div>

                      {/* Case Details Grid */}
                      <div className="grid md:grid-cols-3 gap-4 mb-5 p-5 bg-gradient-to-r from-gray-50 to-orange-50 dark:from-gray-700 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                        <div className="flex items-start space-x-3">
                          <User className="h-6 w-6 text-orange-600 dark:text-orange-300 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-300 font-bold uppercase tracking-wide">Case ID</p>
                            <p className="text-base font-black text-gray-900 dark:text-white">#{caseItem.caseId}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-6 w-6 text-orange-600 dark:text-orange-300 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-300 font-bold uppercase tracking-wide">Last Seen</p>
                            <p className="text-base font-black text-gray-900 dark:text-white truncate">
                              {caseItem.lastSeen?.address || "Location unknown"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-300 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-300 font-bold uppercase tracking-wide">Date</p>
                            <p className="text-base font-black text-gray-900 dark:text-white">
                              {caseItem.lastSeen?.timestamp
                                ? new Date(caseItem.lastSeen.timestamp).toLocaleDateString()
                                : "Date unknown"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {caseItem.description && (
                        <div className="mb-5 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-sm text-gray-700 dark:text-white leading-relaxed font-medium line-clamp-2">
                            {caseItem.description}
                          </p>
                        </div>
                      )}

                      {/* Footer Info */}
                      <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600 dark:text-white font-semibold pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                          Reported: {new Date(caseItem.createdAt).toLocaleDateString()}
                        </span>
                        {caseItem.volunteersAssigned && (
                          <span className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold">
                            <Users className="h-4 w-4" />
                            {caseItem.volunteersAssigned} volunteers helping
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0 w-full lg:w-auto">
                    <Link
                      to={`/cases/${caseItem.caseId}`}
                      className="w-full lg:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-500 dark:to-red-500 text-white font-black text-base rounded-xl hover:from-orange-700 hover:to-red-700 dark:hover:from-orange-600 dark:hover:to-red-600 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105"
                    >
                      View Full Details
                      <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-white to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-xl dark:shadow-orange-950/20 p-8 border-2 border-orange-200 dark:border-gray-600"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Impact Statistics
          </h3>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md dark:shadow-lg">
              <div className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                {cases.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-white font-bold uppercase tracking-wide">Total Cases</div>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-600 rounded-xl shadow-md dark:shadow-lg border-2 border-red-200 dark:border-red-500">
              <div className="text-3xl font-black text-red-600 dark:text-white mb-2">
                {cases.filter((c) => c.status === "active").length}
              </div>
              <div className="text-sm text-red-700 dark:text-white font-bold uppercase tracking-wide">Active Cases</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-600 rounded-xl shadow-md dark:shadow-lg border-2 border-green-200 dark:border-green-500">
              <div className="text-3xl font-black text-green-600 dark:text-white mb-2">
                {cases.filter((c) => c.status === "resolved").length}
              </div>
              <div className="text-sm text-green-700 dark:text-white font-bold uppercase tracking-wide">Resolved Cases</div>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-600 rounded-xl shadow-md dark:shadow-lg border-2 border-orange-200 dark:border-orange-500">
              <div className="text-3xl font-black text-orange-600 dark:text-white mb-2">
                {Math.round(
                  (cases.filter((c) => c.status === "resolved").length /
                    cases.length) *
                    100,
                ) || 0}
                %
              </div>
              <div className="text-sm text-orange-700 dark:text-white font-bold uppercase tracking-wide">Success Rate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cases;
