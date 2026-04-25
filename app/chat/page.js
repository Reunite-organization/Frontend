"use client";

import { ChatPage } from "../../components/pages";
import { useAppNavigation } from "../../lib/use-app-navigation";

export default function Page() {
  const navigate = useAppNavigation();

  return <ChatPage navigate={navigate} />;
}
