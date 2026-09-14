import styles from "./AmbientGradient.module.css";

export default function AmbientGradient() {
  return (
    <div data-ambient="" aria-hidden="true" className={styles.ambient}>
      <div className={styles.sheetA} />
      <div className={styles.sheetB} />
    </div>
  );
}
