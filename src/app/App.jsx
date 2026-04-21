import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { queryClient } from "../lib/queryClient";
import { LanguageProvider } from "../lib/i18n";
import { AuthProvider } from "./providers/AuthProvider";
import { MainHeader } from "../components/layout/MainHeader";
import { MainFooter } from "../components/layout/MainFooter";
import { BrowsePage } from "../features/wanted/components/browse/BrowsePage";
import { useOfflineSync } from "../features/wanted/hooks/useOfflineSync";
import { Router } from "./Router";
function App() {
  useOfflineSync();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <div className="min-h-screen bg-warm-white flex flex-col">
              <MainHeader />
              <main className="flex-1">
                <Router />
              </main>
              <MainFooter />
            </div>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#FDFBF7",
                  border: "1px solid #E8E3D9",
                  color: "#2C2825",
                },
                success: {
                  icon: "❤️",
                  style: {
                    borderColor: "#5B8C6F",
                  },
                },
                error: {
                  icon: "⚠️",
                  style: {
                    borderColor: "#B8554A",
                  },
                },
              }}
            />
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
