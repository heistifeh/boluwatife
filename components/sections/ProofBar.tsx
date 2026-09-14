import styles from "./ProofBar.module.css";

export default function ProofBar() {
  return (
    <section data-screen-label="Proof bar" className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.col}>
          <div className={styles.title}>ISDS: three apps live, one in development</div>
          <div className={styles.chips}>
            <a href="https://apps.apple.com/ng/app/insta-delivery-by-isds/id6746375381" target="_blank" rel="noopener noreferrer" className={styles.chip}>
              Insta-Delivery Customer, App Store
            </a>
            <a href="https://apps.apple.com/ca/app/insta-delivery-vendors/id6748257517" target="_blank" rel="noopener noreferrer" className={styles.chip}>
              Vendors, App Store
            </a>
            <a href="https://apps.apple.com/ar/app/insta-delivery-driver/id6747667869?l=en-GB" target="_blank" rel="noopener noreferrer" className={styles.chip}>
              Driver, App Store
            </a>
            <span className={styles.dashed}>Customer B2B, coming soon</span>
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.title} style={{ fontVariantNumeric: "tabular-nums" }}>
            Fitnex: live PWA, 200+ active users
          </div>
          <a href="https://fitnexonline.com" target="_blank" rel="noopener noreferrer" className={styles.link}>
            fitnexonline.com
          </a>
        </div>
        <div className={styles.col}>
          <div className={styles.title}>Cartify: working demo</div>
          <a href="https://next-ecommerce-eta-nine.vercel.app" target="_blank" rel="noopener noreferrer" className={styles.link}>
            next-ecommerce-eta-nine.vercel.app
          </a>
        </div>
      </div>
    </section>
  );
}
