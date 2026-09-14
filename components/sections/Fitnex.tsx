import Glow from "@/components/Glow";
import Collage from "@/components/Collage";
import { fitnex } from "@/lib/content";
import styles from "./Fitnex.module.css";

export default function Fitnex() {
  return (
    <section id="fitnex" data-screen-label="Fitnex" data-sect="" className={styles.section}>
      <Glow spec={fitnex.glow} />
      <div className={styles.inner}>
        <div className={styles.eyebrow}>{fitnex.eyebrow}</div>
        <h2 className={`${styles.name} font-display`}>{fitnex.name}</h2>
        <p className={styles.desc}>{fitnex.description}</p>
        <div className={styles.statRow}>
          <span className={`${styles.statNum} font-display`}>{fitnex.stat}</span>
          <span className={`${styles.statRest} font-display`}>{fitnex.statRest}</span>
        </div>
        <Collage screens={fitnex.screens} stageHeight={fitnex.stageHeight} heightMarginTop="clamp(26px,4vh,52px)" />
        <div className={styles.footer}>
          <div className={styles.claimBlock}>
            <p className={styles.claim}>{fitnex.claim}</p>
            <div className={styles.stack}>{fitnex.stack}</div>
          </div>
          <div className={styles.actions}>
            {fitnex.cta && (
              <a href={fitnex.cta.href} className={styles.cta} style={{ background: fitnex.cta.gradient, boxShadow: fitnex.cta.shadow }}>
                {fitnex.cta.label}
              </a>
            )}
            {fitnex.secondary && (
              <a href={fitnex.secondary.href} className={styles.secondary}>
                {fitnex.secondary.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
