import { ImageResponse } from "next/og";

export const alt = "Opentity — Never miss a hackathon again";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#020617",
          padding: 60,
          position: "relative",
        }}
      >
        {/* Background glows */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(251,146,60,0.35), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(244,63,94,0.25), transparent 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 34,
              color: "#fb923c",
              fontWeight: 800,
              letterSpacing: "0.2em",
              marginBottom: 40,
            }}
          >
            OPENTITY
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: "#ffffff",
              textAlign: "center",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Never miss a</span>
            <span style={{ color: "#fb923c" }}>hackathon again.</span>
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#94a3b8",
              marginTop: 45,
              textAlign: "center",
            }}
          >
            Discover hackathons, competitions & AI events
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#64748b",
              marginTop: 20,
              fontWeight: 600,
            }}
          >
            opentity.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
