"use client";

import { CreateMemoryPage } from "../../components/pages";
import { useAppNavigation } from "../../lib/use-app-navigation";

export default function Page() {
  const navigate = useAppNavigation();

  return <CreateMemoryPage navigate={navigate} />;
}
