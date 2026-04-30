import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { queryClient } from "../lib/queryClient";
import { LanguageProvider } from "../lib/i18n";
import { AuthProvider } from "./providers/AuthProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { MainHeader } from "../components/layout/MainHeader";
import { MainFooter } from "../components/layout/MainFooter";
import { useOfflineSync } from "../features/wanted/hooks/useOfflineSync";
import { GlobalAIAssistant } from "../components/ai/GlobalAIAssistant";
import { Router } from "./Router";

function App() {
  useOfflineSync();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter> 
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <div className="min-h-screen bg-warm-white flex flex-col">
                <MainHeader />
                <main className="flex-1">
                  <Router />
                </main>
                <MainFooter />
              </div>
              {/* <GlobalAIAssistant /> */}
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
          </ThemeProvider>
        </LanguageProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
