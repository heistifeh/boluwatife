import type { CSSProperties } from "react";
import type { GlowSpec } from "@/lib/content";
import styles from "./Glow.module.css";

export default function Glow({ spec }: { spec: GlowSpec }) {
  const base = Math.max(0, Math.min(1, spec.weight));
  return (
    <div className={styles.glow} data-glow={spec.weight} style={{ opacity: base }} aria-hidden="true">
      {spec.layers.map((layer, i) => (
        <div
          key={i}
          className={styles.layer}
          style={
            {
              "--left": layer.left,
              "--top": layer.top ?? "auto",
              "--bottom": layer.bottom ?? "auto",
              "--width": layer.width,
              "--height": layer.height,
              "--bg": layer.background,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
