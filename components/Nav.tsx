import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <a href="#top" className={`${styles.name} font-display`}>
        Boluwatife Osineye
      </a>
      <div className={styles.links}>
        <a href="#work" className={styles.link}>
          Work
        </a>
        <a href="#stack" className={styles.link}>
          How I build
        </a>
        <a href="#contact" className={styles.link}>
          Contact
        </a>
        <span className={styles.available}>
          <span className={styles.dot} aria-hidden="true" />
          Available
        </span>
      </div>
    </nav>
  );
}
