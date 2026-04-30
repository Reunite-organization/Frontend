import React from "react";
import { Link } from "react-router-dom";
import { Camera, Globe, Mail, Share2, Shield, X } from "lucide-react";
import { useLanguage } from "../../lib/i18n";
import { useAuth } from "../../hooks/useAuth";
import { isAdminRole } from "../../lib/authRoles";

export const MainFooter = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const year = new Date().getFullYear();
  const canAccessAdmin = isAdminRole(user?.role);

  return (
    <footer className="bg-gradient-to-r from-[#1a1a1a] via-[#2b0f0a] to-[#1a1a1a] text-white/80">
      <div className="container py-12 max-w-7xl mx-auto">
        <div className="mb-12 grid gap-8 md:grid-cols-4">

          {/* Logo Section */}
          <div className="col-span-1">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <span className="font-display text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Reunite
              </span>
            </Link>

            <p className="mb-4 text-sm text-white/60">
              Reconnecting people through memory, community, and trust.
            </p>

            <div className="flex gap-3">
              <a
                href="https://twitter.com/reunite"
                className="rounded-full bg-white/10 p-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:scale-110"
              >
                <X className="h-4 w-4" />
              </a>

              <a
                href="https://facebook.com/reunite"
                className="rounded-full bg-white/10 p-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:scale-110"
              >
                <Share2 className="h-4 w-4" />
              </a>

              <a
                href="https://instagram.com/reunite"
                className="rounded-full bg-white/10 p-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:scale-110"
              >
                <Camera className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="mb-4 font-display text-white font-semibold tracking-wide">
              Platform
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/cases" className="text-white/60 transition-all duration-300 hover:text-orange-400 hover:translate-x-1">
                  Cases
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-white/60 transition-all duration-300 hover:text-orange-400 hover:translate-x-1">
                  Report Missing
                </Link>
              </li>
              <li>
                <Link to="/wanted" className="text-white/60 transition-all duration-300 hover:text-orange-400 hover:translate-x-1">
                  Reconnect Hub
                </Link>
              </li>
              <li>
                <Link to="/wanted/stories" className="text-white/60 transition-all duration-300 hover:text-orange-400 hover:translate-x-1">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Operations */}
          <div>
            <h3 className="mb-4 font-display text-white font-semibold tracking-wide">
              Operations
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/volunteers" className="text-white/60 transition-all duration-300 hover:text-orange-400 hover:translate-x-1">
                  Volunteer Response
                </Link>
              </li>

              {canAccessAdmin && (
                <li>
                  <Link to="/admin" className="text-white/60 transition-all duration-300 hover:text-orange-400 hover:translate-x-1">
                    Command Center
                  </Link>
                </li>
              )}

              <li>
                <Link to="/ai" className="text-white/60 transition-all duration-300 hover:text-orange-400 hover:translate-x-1">
                  Help Desk
                </Link>
              </li>

              <li>
                <Link to="/read-more" className="text-white/60 transition-all duration-300 hover:text-orange-400 hover:translate-x-1">
                  Read More
                </Link>
              </li>

              <li>
                <Link to="/faq" className="text-white/60 transition-all duration-300 hover:text-orange-400 hover:translate-x-1">
                  {language !== "am" ? "FAQs" : "ተደጋጋሚ ጥያቄዎች"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-display text-white font-semibold tracking-wide">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-white/60 transition-all duration-300 hover:text-orange-400 hover:translate-x-1">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-white/60 transition-all duration-300 hover:text-orange-400 hover:translate-x-1">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/60 transition-all duration-300 hover:text-orange-400 hover:translate-x-1">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-wrap items-center justify-center gap-6 border-t border-orange-500/20 py-6">
          <div className="flex items-center gap-2 text-white/50 hover:text-orange-400 transition">
            <Shield className="h-4 w-4" />
            <span className="text-xs">Secure & Private</span>
          </div>

          <div className="flex items-center gap-2 text-white/50 hover:text-orange-400 transition">
            <Globe className="h-4 w-4" />
            <span className="text-xs">Global reach</span>
          </div>

          <div className="flex items-center gap-2 text-white/50 hover:text-orange-400 transition">
            <Mail className="h-4 w-4" />
            <span className="text-xs">support@reunite.com</span>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-white/30">
          &copy; {year} Reunite. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
