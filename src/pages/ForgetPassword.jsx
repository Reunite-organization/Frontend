import React from "react";
import { Link } from "react-router-dom";
import { MailQuestion, ArrowLeft } from "lucide-react";

export default function ForgetPassword() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center">
        <MailQuestion className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          Forgot Password
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          We do not store passwords in this system. Use your registered device
          ID to sign in again.
        </p>
        <Link
          to="/auth"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Sign In
        </Link>
      </div>
    </div>
  );
}
