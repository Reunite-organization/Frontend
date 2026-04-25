export default function NotFound() {
  return (
    <div style={{ padding: 40, fontFamily: "var(--sans)" }}>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: 36, color: "var(--navy)", marginBottom: 12 }}>
        Page not found
      </h1>
      <p style={{ color: "var(--gray-3)" }}>
        The page you requested does not exist.
      </p>
    </div>
  );
}
