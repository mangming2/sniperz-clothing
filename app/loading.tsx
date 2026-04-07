export default function Loading() {
  return (
    <main className="loading-screen" aria-label="Loading">
      <div className="loading-mark">
        <div className="loading-ring" />
        <img
          src="/images/logo-white.png"
          alt="SNIPERZ loading"
          className="loading-logo"
        />
      </div>
    </main>
  );
}
