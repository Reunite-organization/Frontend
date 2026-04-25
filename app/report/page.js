"use client";

import { ReportPage } from "../../components/pages";
import { useAppNavigation } from "../../lib/use-app-navigation";

export default function Page() {
  const navigate = useAppNavigation();

  return <ReportPage navigate={navigate} />;
}
