import Glow from "@/components/Glow";
import styles from "./IsdsConnective.module.css";

export default function IsdsConnective() {
  return (
    <section id="work" data-screen-label="ISDS connective moment" data-sect="" className={styles.section}>
      <Glow
        spec={{
          weight: 0.5,
          layers: [
            { bottom: "-50%", left: "50%", width: "120%", height: "96%", background: "radial-gradient(closest-side, rgba(234,208,138,0.616), rgba(185,143,82,0.218) 52%, rgba(11,10,9,0) 78%)" },
          ],
        }}
      />
      <div className={styles.inner}>
        <div className={styles.name}>
          <div className={`${styles.title} font-display`}>ISDS</div>
          <p className={styles.desc}>
            Mobile logistics and commerce for businesses across Nigeria and Africa. Four apps, four different users,
            one platform: customer, vendor, driver, and a business-facing client.
          </p>
        </div>
      </div>
    </section>
  );
}
