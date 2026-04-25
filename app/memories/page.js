"use client";

import { MemoriesPage } from "../../components/pages";
import { useAppNavigation } from "../../lib/use-app-navigation";

export const dynamic = "force-dynamic";

export default function Page() {
  const navigate = useAppNavigation();

  return <MemoriesPage navigate={navigate} />;
}
