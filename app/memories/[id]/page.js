"use client";

import { useParams } from "next/navigation";
import { MemoryDetailPage } from "../../../components/pages";
import { useAppNavigation } from "../../../lib/use-app-navigation";

export const dynamic = "force-dynamic";

export default function Page() {
  const params = useParams();
  const navigate = useAppNavigation();

  return <MemoryDetailPage memId={Number(params?.id)} navigate={navigate} />;
}
