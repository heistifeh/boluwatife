import { ImageResponse } from "next/og";

export const alt = "Boluwatife Osineye, Full-Stack Engineer: React Native, React, Next.js, Node";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Uses the default ImageResponse font so the build never depends on a network font fetch.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 88px",
          background: "#0B0A09",
          backgroundImage:
            "radial-gradient(ellipse 70% 80% at 50% -10%, rgba(226,200,156,0.55), rgba(185,143,82,0.22) 50%, rgba(11,10,9,0) 80%)",
          color: "#ECE6DC",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>
          Boluwatife Osineye
        </div>
        <div style={{ marginTop: 22, fontSize: 52, fontWeight: 600, color: "#E2C89C", letterSpacing: "-0.02em" }}>
          Full-Stack Engineer
        </div>
        <div style={{ marginTop: 56, fontSize: 32, color: "rgba(236,230,220,0.78)" }}>
          React Native · React · Next.js · Node
        </div>
        <div style={{ marginTop: 14, fontSize: 28, color: "#B98F52" }}>boluwatifeosineye.com</div>
      </div>
    ),
    { ...size },
  );
}
