import Glow from "@/components/Glow";
import { stackLayers } from "@/lib/content";
import styles from "./FrontEndToSystem.module.css";

export default function FrontEndToSystem() {
  return (
    <section id="stack" data-screen-label="Front end to system" data-sect="" className={styles.section}>
      <Glow
        spec={{
          weight: 0.36,
          layers: [
            { bottom: "-46%", left: "50%", width: "130%", height: "92%", background: "radial-gradient(closest-side, rgba(185,143,82,0.616), rgba(185,143,82,0.181) 54%, rgba(11,10,9,0) 80%)" },
          ],
        }}
      />
      <div className={styles.inner}>
        <h2 className={`${styles.heading} font-display`}>Front end to system: wallet funding, all the way down</h2>
        <p className={styles.intro}>
          One real feature from Insta-Delivery, traced through every layer I touch. When it breaks, I can find it
          and fix it at any one of them.
        </p>
        <ol className={styles.list}>
          <div className={styles.rail} aria-hidden="true" />
          {stackLayers.map((layer) => (
            <li key={layer.n} data-layer="" className={styles.layer}>
              <span data-dot="" aria-hidden="true" className={styles.dot} />
              <div>
                <div className={styles.head}>
                  <span className={styles.n}>{layer.n}</span>
                  <span className={`${styles.title} font-display`}>{layer.title}</span>
                </div>
                <p className={styles.body}>{layer.body}</p>
                {"code" in layer && layer.code && <div className={styles.code}>{layer.code}</div>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
