import type { CSSProperties } from "react";
import Image from "next/image";
import type { ScreenSpec } from "@/lib/content";
import styles from "./Collage.module.css";

export default function Collage({
  screens,
  stageHeight,
  heightMarginTop,
  variant = "rail",
}: {
  screens: ScreenSpec[];
  stageHeight: string;
  heightMarginTop?: string;
  variant?: "rail" | "fan";
}) {
  return (
    <div
      data-stage=""
      data-variant={variant}
      className={styles.stage}
      style={{ "--stage-height": stageHeight, marginTop: heightMarginTop } as CSSProperties}
    >
      {screens.map((s) => (
        <div
          key={s.src}
          data-screen=""
          data-order={s.order}
          data-rot={s.rot}
          data-rot-mobile={s.mobile?.rot}
          data-m-rot={s.mobile?.rot ?? s.rot}
          className={styles.screen}
          style={
            {
              "--left": s.left,
              "--bottom": s.bottom,
              "--width": s.width,
              "--rot": `${s.rot}deg`,
              "--z": s.z,
              "--order": s.order,
              "--padding": s.padding,
              "--radius": s.radius,
              "--border": s.border,
              "--shadow": s.boxShadow,
              "--filter": s.filter,
              "--img-radius": s.imgRadius,
              "--raised": "var(--raised)",
              "--m-left": s.mobile?.left,
              "--m-bottom": s.mobile?.bottom,
              "--m-width": s.mobile?.width,
              "--m-order": s.mobile?.order,
              "--m-rot": s.mobile?.rot !== undefined ? `${s.mobile.rot}deg` : undefined,
              "--m-z": s.mobile?.z,
              "--m-padding": s.mobile?.padding,
              "--m-radius": s.mobile?.radius,
              "--m-border": s.mobile?.border,
              "--m-shadow": s.mobile?.boxShadow,
              "--m-filter": s.mobile?.filter,
              "--m-img-radius": s.mobile?.imgRadius,
              "--m-display": s.mobile?.hidden ? "none" : undefined,
              "--d-display": s.desktopHidden ? "none" : undefined,
            } as CSSProperties
          }
        >
          <Image
            src={s.src}
            alt={s.alt}
            width={520}
            height={1099}
            className={styles.img}
            priority={s.eager}
            loading={s.eager ? undefined : "lazy"}
          />
        </div>
      ))}
    </div>
  );
}
