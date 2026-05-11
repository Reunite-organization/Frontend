import { apiBaseUrl } from "../lib/apiConfig";

const isProd = !import.meta.env.DEV;

const beaconUrl = () => `${apiBaseUrl}/api/monitoring/client-event`;

const send = (payload) => {
  if (!isProd) return;

  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(beaconUrl(), new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch(beaconUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // never throw
  }
};

const safeNumber = (value) => (typeof value === "number" && Number.isFinite(value) ? value : null);

function startWebVitals({ language = "en" } = {}) {
  if (!isProd) return;

  try {
    // Largest Contentful Paint (LCP)
    if ("PerformanceObserver" in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (!last) return;
        send({
          type: "web_vital",
          language,
          path: window.location.pathname,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          details: {
            name: "LCP",
            value: safeNumber(last.startTime),
          },
        });
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        send({
          type: "web_vital",
          language,
          path: window.location.pathname,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          details: {
            name: "CLS",
            value: safeNumber(clsValue),
          },
        });
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });

      // First Contentful Paint (FCP)
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            send({
              type: "web_vital",
              language,
              path: window.location.pathname,
              userAgent: navigator.userAgent,
              referrer: document.referrer,
              details: {
                name: "FCP",
                value: safeNumber(entry.startTime),
              },
            });
          }
        }
      });
      paintObserver.observe({ type: "paint", buffered: true });
    }
  } catch {
    // never throw
  }
}

export function initClientMonitoring({ language = "en" } = {}) {
  if (!isProd) return;

  startWebVitals({ language });

  window.addEventListener("error", (event) => {
    send({
      type: "window_error",
      language,
      path: window.location.pathname,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      details: {
        message: event?.message,
        filename: event?.filename,
        lineno: event?.lineno,
        colno: event?.colno,
      },
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event?.reason;
    send({
      type: "unhandledrejection",
      language,
      path: window.location.pathname,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      details: {
        message: reason instanceof Error ? reason.message : String(reason),
      },
    });
  });
}

