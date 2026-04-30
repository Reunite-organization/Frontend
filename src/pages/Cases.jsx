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
        return <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />;
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />;
      case "investigating":
        return <Clock className="h-5 w-5 text-orange-500 dark:text-orange-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700";
      case "resolved":
        return "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700";
      case "investigating":
        return "bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-700";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:from-black dark:via-orange-950/20 dark:to-black dark:bg-gradient-to-b flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-stone-300">Loading cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:from-black dark:via-orange-950/20 dark:to-black dark:bg-gradient-to-b">
      {/* Header */}
      <header className="bg-white dark:bg-black/50 shadow-sm dark:shadow-orange-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Missing Persons Cases
            </h1>
            <Link
              to="/report"
              className="bg-red-600 dark:bg-red-500 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-semibold text-base shadow-md hover:shadow-lg"
            >
              Report Missing Person
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-stone-900/30 rounded-lg shadow-sm dark:shadow-orange-950/20 p-6 mb-8 border border-stone-200 dark:border-stone-800"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by name, case ID, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-stone-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-stone-400 font-medium"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400 dark:text-stone-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-stone-800 text-gray-900 dark:text-white font-semibold text-base cursor-pointer"
              >
                <option value="all" className="font-semibold">All Status</option>
                <option value="active" className="font-semibold text-red-600">🔴 High Priority</option>
                <option value="investigating" className="font-semibold text-orange-600">🟠 Active</option>
                <option value="resolved" className="font-semibold text-green-600">🟢 Resolved</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Cases Grid */}
        <div className="grid gap-6">
          {filteredCases.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <AlertCircle className="h-12 w-12 text-gray-400 dark:text-stone-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No cases found
              </h3>
              <p className="text-gray-600 dark:text-stone-400">
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
                transition={{ delay: index * 0.1 }}
                <div className="bg-white dark:bg-stone-900/30 rounded-lg shadow-sm dark:shadow-orange-950/20 p-6 hover:shadow-md dark:hover:shadow-orange-950/30 transition-shadow border border-stone-200 dark:border-stone-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(caseItem.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {caseItem.missingPerson?.name || "Unknown Name"}
                        </h3>
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(caseItem.status)}`}
                        >
                          {caseItem.status}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-stone-300">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400 dark:text-stone-400" />
                          Case #{caseItem.caseId}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400 dark:text-stone-400" />
                          {caseItem.lastSeen?.address || "Location unknown"}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400 dark:text-stone-400" />
                          {caseItem.lastSeen?.timestamp
                            ? new Date(
                                caseItem.lastSeen.timestamp,
                              ).toLocaleDateString()
                            : "Date unknown"}
                        </div>
                      </div>

                      {caseItem.description && (
                        <p className="mt-3 text-sm text-gray-700 dark:text-stone-300 line-clamp-2">
                          {caseItem.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-center space-x-4 text-xs text-gray-500 dark:text-stone-400">
                        <span>
                          Reported:{" "}
                          {new Date(caseItem.createdAt).toLocaleDateString()}
                        </span>
                        {caseItem.volunteersAssigned && (
                          <span>
                            {caseItem.volunteersAssigned} volunteers assigned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <Link
                      to={`/cases/${caseItem.caseId}`}
                      className="inline-flex items-center px-4 py-2 bg-orange-600 dark:bg-orange-500 text-white font-semibold text-sm rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
                    >
                      View Details →
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
          className="mt-8 bg-white dark:bg-stone-900/30 rounded-lg shadow-sm dark:shadow-orange-950/20 p-6 border border-stone-200 dark:border-stone-800"
        >
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {cases.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-stone-400 font-medium">Total Cases</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {cases.filter((c) => c.status === "active").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-stone-400 font-medium">Active Cases</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {cases.filter((c) => c.status === "resolved").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-stone-400 font-medium">Resolved Cases</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {Math.round(
                  (cases.filter((c) => c.status === "resolved").length /
                    cases.length) *
                    100,
                ) || 0}
                %
              </div>
              <div className="text-sm text-gray-600 dark:text-stone-400 font-medium">Success Rate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cases;
