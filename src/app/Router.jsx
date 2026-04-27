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
      <Route path="/report" element={<ReportCasePage />} />
      <Route path="/volunteers" element={<VolunteerOperationsPage />} />
      <Route path="/volunteer" element={<Navigate to="/volunteers" replace />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminControlPage />} />
      </Route>
      <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
      <Route path="/ai" element={<AIDeskPage />} />

      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      <Route path="/wanted" element={<BrowsePage />} />
      <Route path="/wanted/stories" element={<StoriesPage />} />
      <Route
        path="/stories/success"
        element={<Navigate to="/wanted/stories" replace />}
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/wanted/post/:id" element={<PostDetailPage />} />
        <Route path="/wanted/create" element={<CreatePostPage />} />
        <Route path="/wanted/stories/share" element={<CreateStory />} />
        <Route path="/wanted/profile" element={<ProfilePage />} />
        <Route path="/wanted/claims" element={<ClaimsPage />} />
        <Route path="/wanted/chat/:roomId?" element={<ChatPage />} />
        <Route path="/wanted/profile/create" element={<CreateProfilePage />} />
      </Route>

      <Route path="/how-it-works" element={<div>How It Works</div>} />
      <Route path="/about" element={<div>About</div>} />
      <Route path="/mission" element={<div>Mission</div>} />
      <Route path="/contact" element={<div>Contact</div>} />
      <Route path="/privacy-policy" element={<div>Privacy Policy</div>} />
      <Route path="/terms-of-service" element={<div>Terms of Service</div>} />

      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
