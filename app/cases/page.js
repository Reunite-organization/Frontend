"use client";

import { CasesPage } from "../../components/pages";
import { useSiteShell } from "../../components/site-shell";
import { useAppNavigation } from "../../lib/use-app-navigation";

export default function Page() {
  const { openSighting } = useSiteShell();
  const navigate = useAppNavigation();

  return <CasesPage navigate={navigate} openSighting={openSighting} />;
}
