import Glow from "@/components/Glow";
import Collage from "@/components/Collage";
import { cartify } from "@/lib/content";
import styles from "./Cartify.module.css";

export default function Cartify() {
  return (
    <section id="cartify" data-screen-label="Cartify" data-sect="" className={styles.section}>
      <Glow spec={cartify.glow} />
      <div className={styles.inner}>
        <div className={styles.copy}>
          <div className={styles.badgeRow}>
            <span className={styles.eyebrow}>{cartify.eyebrow}</span>
            <span className={styles.badge}>{cartify.badge.label}</span>
          </div>
          <h2 className={`${styles.name} font-display`}>Cartify</h2>
          <p className={styles.desc}>{cartify.description}</p>
          <div className={styles.stack}>{cartify.stack}</div>
          <div className={styles.actions}>
            <a href={cartify.primary.href} target="_blank" rel="noopener noreferrer" className={styles.action}>
              {cartify.primary.label}
            </a>
            <a href={cartify.secondary.href} target="_blank" rel="noopener noreferrer" className={styles.action}>
              {cartify.secondary.label}
            </a>
          </div>
        </div>
        <div className={styles.stageWrap}>
          <Collage screens={cartify.screens} stageHeight={cartify.stageHeight} />
        </div>
      </div>
    </section>
  );
}
