import { Routes, Route } from "react-router-dom";
import { LandingPage } from "../pages/Landing";
import { BrowsePage } from "../features/wanted/components/browse/BrowsePage";
import { PostDetailPage } from "../features/wanted/components/post/PostDetailPage";
import { CreatePostPage } from "../features/wanted/components/create/CreatePostPage";
import { ProfilePage } from "../features/wanted/components/profile/ProfilePage";
import { ClaimsPage } from "../features/wanted/components/claims/ClaimsPage";
import { ChatPage } from "../features/wanted/components/chat/ChatPage";
import { SuccessStories } from "../features/wanted/components/shared/SuccessStories";
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* for wanted */}
      <Route path="/wanted" element={<BrowsePage />} />
      <Route path="/wanted/post/:id" element={<PostDetailPage />} />
      <Route path="/wanted/create" element={<CreatePostPage />} />
      <Route path="/wanted/profile" element={<ProfilePage />} />
      <Route path="/wanted/claims" element={<ClaimsPage />} />
      <Route path="/wanted/chat/:roomId?" element={<ChatPage />} />
      <Route path="/wanted/stories"  element = {<SuccessStories />}/>
     

     {/* for missing */}
     
      {/* Auth */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />


      {/* general */}
      <Route path="/how-it-works" element={<div>How It Works</div>} />
      <Route path="/about" element={<div>About</div>} />
      <Route path="/mission" element={<div>Mission</div>} />
    </Routes>
  );
};
