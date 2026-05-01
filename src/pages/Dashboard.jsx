import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Users,
  FileText,
  BarChart3,
  Shield,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import MissionBanner from "@/components/layout/MissionBanner";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/auth");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadDashboardData();
    } catch (error) {
      navigate("/auth");
    }
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      // Load user stats
      const statsResponse = await fetch(
        "/api/users/volunteer/stats/" + user?.deviceId,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Load recent cases
      const casesResponse = await fetch("/api/cases?limit=5", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const casesData = await casesResponse.json();
      if (casesData.success) {
        setRecentCases(casesData.data);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:from-black dark:via-orange-950/20 dark:to-black dark:bg-gradient-to-b flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-stone-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:from-black dark:via-orange-950/20 dark:to-black dark:bg-gradient-to-b">
      <MissionBanner />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome back, {user?.name || "Volunteer"}!
          </h2>
          <p className="text-gray-600">
            You're helping reunite families across Ethiopia. Here's your impact
            today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Cases Assisted
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.casesAssisted || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Search Hours
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalSearches || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Shield className="h-6 w-6 text-slate-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Trust Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.trustScore || 0}%
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Current Zone
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats.currentZone || "Not assigned"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/report")}
              className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
            >
              <Plus className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Report Missing
              </span>
            </button>

            <button
              onClick={() => navigate("/cases")}
              className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <Search className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">
                View Cases
              </span>
            </button>

            <button
              onClick={() => navigate("/map")}
              className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
            >
              <MapPin className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Search Map
              </span>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              <Settings className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">
                My Profile
              </span>
            </button>
          </div>
        </motion.div>

        {/* Recent Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Cases
            </h3>
            <button
              onClick={() => navigate("/cases")}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
            >
              View all →
            </button>
          </div>

          <div className="space-y-4">
            {recentCases.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent cases</p>
            ) : (
              recentCases.map((caseItem) => (
                <div
                  key={caseItem.caseId}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        caseItem.status === "active"
                          ? "bg-red-500"
                          : caseItem.status === "resolved"
                            ? "bg-emerald-500"
                            : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        Case #{caseItem.caseId}
                      </p>
                      <p className="text-sm text-gray-600">
                        {caseItem.lastSeen?.address || "Location unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        caseItem.status === "active"
                          ? "bg-red-100 text-red-800"
                          : caseItem.status === "resolved"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {caseItem.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(caseItem.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
