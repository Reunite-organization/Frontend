import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { LandingPage } from "../pages/Landing";
import MissingCasesPage from "../pages/MissingCasesPage";
import MissingCaseDetailPage from "../pages/MissingCaseDetailPage";
import ReportCasePage from "../pages/ReportCasePage";
import VolunteerOperationsPage from "../pages/VolunteerOperationsPage";
import AdminControlPage from "../pages/AdminControlPage";
import AIDeskPage from "../pages/AIDeskPage";
import { BrowsePage } from "../features/wanted/components/browse/BrowsePage";
import { PostDetailPage } from "../features/wanted/components/post/PostDetailPage";
import { CreatePostPage } from "../features/wanted/components/create/CreatePostPage";
import { ProfilePage } from "../features/wanted/components/profile/ProfilePage";
import { ClaimsPage } from "../features/wanted/components/claims/ClaimsPage";
import { ChatPage } from "../features/wanted/components/chat/ChatPage";
import { StoriesPage } from "../features/wanted/stories/StoriesPage";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { ForgotPasswordPage } from "../features/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "../features/auth/ResetPasswordPage";
import { CreateProfilePage } from "../features/wanted/components/profile/CreateProfilePage";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./RoleRoute";
import { CreateStory } from "../features/wanted/stories/CreateStory";
import ReadMorePage from "../components/ReadMorePage";
import FAQPage from "../components/FAQPage";
import MapPage from "../pages/Map";
import SettingsPage from "../pages/SettingsPage";
import SupportPage from "../pages/SupportPage";
import { StaticInfoPage } from "../components/layout/StaticInfoPage";

const LegacyCaseRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/cases/${id}`} replace />;
};

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/cases" element={<MissingCasesPage />} />
      <Route path="/cases/:id" element={<MissingCaseDetailPage />} />
      <Route path="/case/:id" element={<LegacyCaseRedirect />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/report" element={<ReportCasePage />} />
        <Route path="/volunteers" element={<VolunteerOperationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route
        path="/volunteer"
        element={<Navigate to="/volunteers" replace />}
      />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminControlPage />} />
      </Route>
      <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
      <Route path="/ai" element={<AIDeskPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/forget-password"
        element={<Navigate to="/auth/forgot-password" replace />}
      />
      <Route path="/reconnect" element={<Navigate to="/wanted" replace />} />
      <Route path="/wanted" element={<BrowsePage />} />
      <Route path="/wanted/post/:id" element={<PostDetailPage />} />
      <Route path="/wanted/stories" element={<StoriesPage />} />
      <Route
        path="/stories/success"
        element={<Navigate to="/wanted/stories" replace />}
      />
      <Route element={<ProtectedRoute />}>
        <Route path="/wanted/create" element={<CreatePostPage />} />
        <Route path="/wanted/stories/share" element={<CreateStory />} />
        <Route path="/wanted/profile" element={<ProfilePage />} />
        <Route path="/wanted/claims" element={<ClaimsPage />} />
        <Route path="/wanted/chat/:roomId?" element={<ChatPage />} />
        <Route path="/wanted/profile/create" element={<CreateProfilePage />} />
      </Route>

      <Route path="/read-more" element={<ReadMorePage />} />
      <Route path="/faq" element={<FAQPage />} />{" "}
      <Route path="/map" element={<MapPage />} />
      <Route
        path="/how-it-works"
        element={
          <StaticInfoPage
            eyebrow="How it works"
            title="How Reunite supports safe, coordinated reporting"
            description="A clear process designed for stressful moments with reliability and trust."
            sections={[
              {
                heading: "1. Report quickly",
                body: "Users submit missing or found-person reports with essential details first, then enrich data safely.",
              },
              {
                heading: "2. Verify and coordinate",
                body: "Coordinators and trusted volunteers validate sightings, reduce false positives, and align response tasks.",
              },
              {
                heading: "3. Keep families informed",
                body: "Case updates, moderation safeguards, and controlled communications help maintain trust.",
              },
            ]}
          />
        }
      />
      <Route
        path="/contact"
        element={
          <StaticInfoPage
            eyebrow="Contact"
            title="Contact Reunite operations"
            description="Reach the team for support, partnerships, and urgent operational coordination."
            sections={[
              {
                heading: "Support",
                body: "For platform support and report assistance, use the in-app support flow or email support@reunite.com.",
              },
              {
                heading: "Partnerships",
                body: "Organizations and institutions can submit collaboration requests through the support page.",
              },
            ]}
          />
        }
      />
      <Route path="/support" element={<SupportPage />} />
      <Route
        path="/privacy-policy"
        element={
          <StaticInfoPage
            eyebrow="Privacy policy"
            title="Your data is handled with safety and accountability"
            description="Reunite processes sensitive information under strict operational safeguards."
            sections={[
              {
                heading: "Data minimization",
                body: "Only information required for search, verification, and response coordination is collected.",
              },
              {
                heading: "Access control",
                body: "Sensitive case details are restricted to authorized roles and verified workflows.",
              },
              {
                heading: "Security and retention",
                body: "Data is protected in transit and at rest, with retention aligned to operational and legal requirements.",
              },
            ]}
          />
        }
      />
      <Route
        path="/terms-of-service"
        element={
          <StaticInfoPage
            eyebrow="Terms of service"
            title="Platform terms for safe and responsible use"
            description="These terms help protect families, volunteers, and institutional partners."
            sections={[
              {
                heading: "Lawful use",
                body: "Users must submit accurate information and avoid fraudulent or harmful activity.",
              },
              {
                heading: "Moderation and enforcement",
                body: "Reunite may review, suspend, or remove content and accounts that violate safety requirements.",
              },
              {
                heading: "Operational limitations",
                body: "The platform assists coordination and does not replace emergency authorities when immediate danger exists.",
              },
            ]}
          />
        }
      />
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
