"use client";

import { AdminPage } from "../../components/pages";
import { useAppNavigation } from "../../lib/use-app-navigation";

export default function Page() {
  const navigate = useAppNavigation();

  return <AdminPage navigate={navigate} />;
}
