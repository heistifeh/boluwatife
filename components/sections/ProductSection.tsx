import type { CSSProperties } from "react";
import Glow from "@/components/Glow";
import Collage from "@/components/Collage";
import type { ProductSection as ProductSectionData } from "@/lib/content";
import styles from "./ProductSection.module.css";

export default function ProductSection({ data }: { data: ProductSectionData }) {
  return (
    <section id={data.id} data-screen-label={data.name} data-sect="" className={styles.section}>
      <Glow spec={data.glow} />
      <div className={styles.inner}>
        <div className={styles.badgeRow}>
          <span className={styles.eyebrow} style={{ color: data.eyebrowColor }}>
            {data.eyebrow}
          </span>
          {data.badge && <span className={styles.badge}>{data.badge.label}</span>}
        </div>
        <h2 className={`${styles.name} font-display`} style={{ fontSize: data.nameSize } as CSSProperties}>
          {data.name}
        </h2>
        <p className={styles.desc} style={{ fontSize: data.descriptionSize }}>
          {data.description}
        </p>
        <Collage screens={data.screens} stageHeight={data.stageHeight} heightMarginTop="clamp(24px,4vh,48px)" />
        <div className={styles.footer}>
          <div className={styles.claimBlock}>
            <div className={`${styles.claim} font-display`} style={{ fontSize: data.claimSize ?? "clamp(22px,2.4vw,34px)" }}>
              {data.claim}
            </div>
            <div className={styles.stack}>{data.stack}</div>
          </div>
          {(data.cta || data.secondary) && (
            <div className={styles.actions}>
              {data.cta && (
                <a
                  href={data.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.cta}
                  style={{ background: data.cta.gradient, boxShadow: data.cta.shadow }}
                >
                  {data.cta.label}
                </a>
              )}
              {data.secondary && (
                <a href={data.secondary.href} target="_blank" rel="noopener noreferrer" className={styles.secondary}>
                  {data.secondary.label}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
