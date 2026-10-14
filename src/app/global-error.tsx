"use client";

/** Last-resort screen if the whole app fails to load (replaces the root layout, so styles are inline). */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100dvh", display: "grid", placeItems: "center", background: "#000C14", color: "#fff", fontFamily: "Poppins, system-ui, sans-serif", padding: 16 }}>
        <div style={{ maxWidth: 440, display: "flex", flexDirection: "column", gap: 16 }}>
          <h1 style={{ margin: 0, fontSize: 30, fontStyle: "italic", fontWeight: 800 }}>Something went wrong</h1>
          <p style={{ margin: 0, color: "#C2D1D7", lineHeight: 1.5 }}>
            Please try again. If you were joining the waitlist, join again with the same email and we&apos;ll show your festival card.
          </p>
          <button type="button" onClick={() => window.location.reload()}
            style={{ font: "600 16px Poppins, system-ui, sans-serif", background: "#0A7AE8", color: "#fff", border: 0, borderRadius: 999, padding: "15px 24px", cursor: "pointer" }}>
            Try again
          </button>
          <a href="https://www.instagram.com/minflix" style={{ color: "#C2D1D7", fontSize: 13 }}>Still stuck? Message us on Instagram</a>
          {error?.digest && <p style={{ margin: 0, fontSize: 12, color: "#8FA4AD" }}>Reference: {error.digest}</p>}
        </div>
      </body>
    </html>
  );
}
