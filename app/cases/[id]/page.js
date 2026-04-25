"use client";

import { useParams } from "next/navigation";
import { CaseDetailPage } from "../../../components/pages";
import { useSiteShell } from "../../../components/site-shell";
import { useAppNavigation } from "../../../lib/use-app-navigation";

export default function Page() {
  const params = useParams();
  const { openSighting } = useSiteShell();
  const navigate = useAppNavigation();

  return (
    <CaseDetailPage
      caseId={Number(params?.id)}
      navigate={navigate}
      openSighting={openSighting}
    />
  );
}
