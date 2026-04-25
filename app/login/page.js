"use client";

import { LoginPage } from "../../components/pages";
import { useSiteShell } from "../../components/site-shell";
import { useAppNavigation } from "../../lib/use-app-navigation";

export default function Page() {
  const { setLoggedIn } = useSiteShell();
  const navigate = useAppNavigation();

  return (
    <LoginPage
      navigate={navigate}
      onLogin={() => setLoggedIn(true)}
    />
  );
}
