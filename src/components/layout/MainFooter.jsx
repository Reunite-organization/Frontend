import React from "react";
import { Link } from "react-router-dom";
import { Camera, Globe, Mail, Share2, Shield, X } from "lucide-react";
import { useLanguage } from "../../lib/i18n";
import { useAuth } from "../../hooks/useAuth";
import { isAdminRole } from "../../lib/authRoles";
import { Send } from 'lucide-react'
export const MainFooter = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const year = new Date().getFullYear();
  const canAccessAdmin = isAdminRole(user?.role);

  return (
    <footer className="bg-[#423c39] text-white/80">
      <div className="container py-12">
        <div className="mb-12 grid gap-8 md:grid-cols-4">
          <div className="col-span-1">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <span className="font-display text-xl font-bold text-white">
                Reunite
              </span>
            </Link>
            <p className="mb-4 text-sm text-white/60">
              {language === "am"
                ? "Reconnecting people through memory, community, and trust."
                : "Reconnecting people through memory, community, and trust."}
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com/reunite"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-terracotta"
              >
                <X className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com/reunite"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-terracotta"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/reunite"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-terracotta"
              >
                <Camera className="h-4 w-4" />
              </a>
               <a
                href="https://t.me/reunite_world"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-terracotta"
              >
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-white">
              {language === "am" ? "Platform" : "Platform"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/cases"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {language === "am" ? "ኬዞች" : "Cases"}
                </Link>
              </li>
              <li>
                <Link
                  to="/report"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {language === "am" ? "የጠፉ ሰዎችን ያመልክቱ" : "Report Missing"}
                </Link>
              </li>
              <li>
                <Link
                  to="/wanted"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {language === "am" ? "እንደገና ለመገናኘት" : "Reconnect Hub"}
                </Link>
              </li>
              <li>
                <Link
                  to="/wanted/stories"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {language === "am" ? "የተሳኩ ታሪኮች" : "Success Stories"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-white">
              {language === "am" ? "Operations" : "Operations"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/volunteers"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {language === "am"
                    ? "የበጎ ፈቃደኞች ምላሽ"
                    : "Volunteer Response"}
                </Link>
              </li>
              {canAccessAdmin ? (
                <li>
                  <Link
                    to="/admin"
                    className="text-white/60 transition-colors hover:text-white"
                  >
                    {language === "am" ? "የቁጥጥር ማዕከል" : "Command Center"}
                  </Link>
                </li>
              ) : null}
              <li>
                <Link
                  to="/ai"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {language === "am" ? "እርዳታ" : "Help Desk"}
                </Link>
              </li>
                <li><Link
                  to="/read-more"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Read More
                </Link></li>
                <li>
                
                <Link
                  to="/faq"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {language !== "am" ? "FAQs" : "ተደጋጋሚ ጥያቄዎች"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-white">
              {language === "am" ? "ደንቦች" : "Legal"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {language === "am" ? "ደንነት" : "Privacy"}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {language === "am" ? "ተርሞች" : "Terms"}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {language === "am" ? "ለበለጠ መረጃ" : "Contact"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 border-t border-white/10 py-6">
          <div className="flex items-center gap-2 text-white/40">
            <Shield className="h-4 w-4" />
            <span className="text-xs">
              {language === "am" ? "ደንነት" : "Secure & Private"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-white/40">
            <Globe className="h-4 w-4" />
            <span className="text-xs">
              {language === "am" ? "ተደራሽነት" : "Global reach"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-white/40">
            <Mail className="h-4 w-4" />
            <span className="text-xs">support@reunite.com</span>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-white/30">
          &copy; {year} Reunite.{" "}
          {language === "am" ? "መብቱ በሕግ የተጠበቀ ነው." : "All rights reserved."}
        </div>
      </div>
    </footer>
  );
};
