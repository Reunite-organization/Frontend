"use client";

import { HomePage } from "../components/pages";
import { useSiteShell } from "../components/site-shell";
import { useAppNavigation } from "../lib/use-app-navigation";

export default function Page() {
  const { openSighting } = useSiteShell();
  const navigate = useAppNavigation();

  return <HomePage navigate={navigate} openSighting={openSighting} />;
}
