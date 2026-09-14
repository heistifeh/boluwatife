import type { ReactNode } from "react";
import Glow from "@/components/Glow";
import { trackRecordBlock } from "@/lib/content";
import styles from "./TrackRecord.module.css";

function bodyWithHighlights(body: string, highlights: readonly string[]) {
  const parts: (string | ReactNode)[] = [body];
  highlights.forEach((highlight, hIdx) => {
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (typeof part !== "string") continue;
      const idx = part.indexOf(highlight);
      if (idx === -1) continue;
      parts.splice(
        i,
        1,
        part.slice(0, idx),
        <span key={`${hIdx}-${idx}`} className={styles.highlight}>
          {highlight}
        </span>,
        part.slice(idx + highlight.length)
      );
      break;
    }
  });
  return parts;
}

export default function TrackRecord() {
  return (
    <section data-screen-label="Track record" data-sect="" className={styles.section}>
      <Glow
        spec={{
          weight: 0.42,
          layers: [
            { bottom: "-40%", left: "50%", width: "150%", height: "86%", background: "radial-gradient(closest-side, rgba(185,143,82,0.725), rgba(185,143,82,0.218) 56%, rgba(11,10,9,0) 80%)" },
          ],
        }}
      />
      <div className={styles.inner}>
        <h2 className={`${styles.heading} font-display`}>{trackRecordBlock.title}</h2>
        <p className={styles.body}>{bodyWithHighlights(trackRecordBlock.body, trackRecordBlock.highlights)}</p>
      </div>
    </section>
  );
}
