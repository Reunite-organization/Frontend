import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
  Star,
} from "lucide-react";
import { toast } from "sonner";

const Volunteer = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    skills: [],
    availability: "",
    experience: "",
    motivation: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const skills = [
    "Search and Rescue",
    "First Aid/CPR",
    "Driving",
    "Communication",
    "Technology",
    "Local Knowledge",
    "Photography",
    "Translation",
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillToggle = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.includes(skill)
        ? formData.skills.filter((s) => s !== skill)
        : [...formData.skills, skill],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/volunteers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Thank you for volunteering! We'll contact you soon.");
        navigate("/auth");
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:from-black dark:via-orange-950/20 dark:to-black dark:bg-gradient-to-b">
      {/* Header */}
      <header className="bg-white dark:bg-black/50 shadow-sm dark:shadow-orange-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Join Search Teams
            </h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-600 to-slate-900 rounded-lg p-8 text-white mb-8"
        >
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-bold">Become a Search Volunteer</h2>
          </div>
          <p className="text-lg opacity-90 mb-6">
            Join thousands of Ethiopians who are making a real difference. Your
            skills and dedication help bring families together.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Save lives daily</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Professional training</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Community impact</span>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm p-6 space-y-6"
        >
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Volunteer Application
            </h3>
            <p className="text-sm text-gray-600">
              Tell us about yourself and how you can help
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="+251 XXX XXX XXX"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="City, region"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Skills & Experience
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {skills.map((skill) => (
                <label key={skill} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability *
            </label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            >
              <option value="">Select availability</option>
              <option value="full-time">Full-time (40+ hours/week)</option>
              <option value="part-time">Part-time (20-30 hours/week)</option>
              <option value="weekends">Weekends only</option>
              <option value="emergency">Emergency response only</option>
              <option value="flexible">Flexible/on-call</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Previous Experience
            </label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Tell us about any relevant experience (search & rescue, emergency response, community work, etc.)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why do you want to volunteer? *
            </label>
            <textarea
              name="motivation"
              value={formData.motivation}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="What motivates you to help find missing persons?"
              required
            />
          </div>

          {/* Benefits */}
          <div className="bg-emerald-50 rounded-lg p-4">
            <h4 className="font-semibold text-emerald-900 mb-2">
              What you'll get:
            </h4>
            <ul className="text-sm text-emerald-800 space-y-1">
              <li>• Professional training and certification</li>
              <li>• Access to our AI-powered search tools</li>
              <li>• Community recognition and impact tracking</li>
              <li>• Emergency response coordination</li>
              <li>• Support from experienced team leaders</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Submitting..." : "Join Search Teams"}
            </button>
          </div>
        </motion.form>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Our Volunteer Community
          </h3>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600">3,891</div>
              <div className="text-sm text-gray-600">Active Volunteers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">1,247</div>
              <div className="text-sm text-gray-600">People Reunited</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-600">AI Monitoring</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">98%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Volunteer;
