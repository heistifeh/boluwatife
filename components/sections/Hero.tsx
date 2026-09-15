import Glow from "@/components/Glow";
import Collage from "@/components/Collage";
import { heroScreens } from "@/lib/content";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section data-screen-label="Hero" data-sect="" className={styles.section}>
      <Glow
        spec={{
          weight: 1.15,
          layers: [
            { top: "-10%", left: "50%", width: "150%", height: "74%", background: "radial-gradient(closest-side, rgba(185,143,82,0.741), rgba(185,143,82,0.271) 54%, rgba(11,10,9,0) 78%)" },
            { top: "-8%", left: "50%", width: "104%", height: "54%", background: "radial-gradient(closest-side, rgba(226,200,156,0.741), rgba(226,200,156,0.508) 44%, rgba(185,143,82,0.128) 70%, rgba(11,10,9,0) 85%)" },
            { top: "6%", left: "50%", width: "62%", height: "30%", background: "radial-gradient(closest-side, rgba(244,233,208,0.741), rgba(226,200,156,0.271) 52%, rgba(11,10,9,0) 78%)" },
          ],
        }}
      />
      <div className={styles.inner}>
        <div style={{ position: "relative" }}>
          <div className={styles.fade} aria-hidden="true" />
          <Collage screens={heroScreens} stageHeight="clamp(280px,41vw,580px)" variant="fan" />
        </div>
        <h1 className={`${styles.headline} font-display`}>
          Boluwatife Osineye
          <span className={styles.subhead}>Mobile &amp; Web Engineer</span>
        </h1>
        <p className={`${styles.claim} font-display`}>I turn business problems into products that ship.</p>
        <div className={styles.stats}>
          <span>4 systems live</span>
          <span className={styles.rule} aria-hidden="true" />
          <span>
            <span className={styles.num}>200+</span>{" "}
            <span className={styles.dOnly}>users on a solo build</span>
            <span className={styles.mOnly}>users, solo build</span>
          </span>
          <span className={styles.rule} aria-hidden="true" />
          <span>
            <span className={styles.num}>100+</span>{" "}
            <span className={styles.dOnly}>developers mentored</span>
            <span className={styles.mOnly}>devs mentored</span>
          </span>
        </div>
      </div>
    </section>
  );
}
