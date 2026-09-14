import Glow from "@/components/Glow";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section
      id="contact"
      data-screen-label="Contact"
      data-sect=""
      className={styles.section}
    >
      <Glow
        spec={{
          weight: 0.7,
          layers: [
            {
              bottom: "-36%",
              left: "50%",
              width: "120%",
              height: "86%",
              background:
                "radial-gradient(closest-side, rgba(185,143,82,0.741), rgba(185,143,82,0.236) 54%, rgba(11,10,9,0) 80%)",
            },
            {
              bottom: "-18%",
              left: "50%",
              width: "48%",
              height: "42%",
              background:
                "radial-gradient(closest-side, rgba(226,200,156,0.741), rgba(226,200,156,0.327) 46%, rgba(11,10,9,0) 84%)",
            },
          ],
        }}
      />
      <div className={styles.inner}>
        <h2 className={`${styles.heading} font-display`}>
          Have a product idea? Let&apos;s talk.
        </h2>
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=boluwatife.e.osineye@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
        >
          Start a conversation
        </a>
        <div className={styles.details}>
          <div className={styles.col}>
            <div className={styles.label}>Availability</div>
            <div className={styles.value}>
              Open to full-time and contract work, available to work remotely
              with teams anywhere.
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.label}>Elsewhere</div>
            <div className={styles.links}>
              <a
                href="https://github.com/heistifeh"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/heistifeh
              </a>
              <a
                href="https://linkedin.com/in/boluwatifeosineye"
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin.com/in/boluwatifeosineye
              </a>
              <a
                href="https://boluwatifeosineye.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                boluwatifeosineye.com
              </a>
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.label}>Résumé</div>
            <div className={styles.value}>Available on request.</div>
          </div>
        </div>
        <div className={styles.footer}>
          <span>Boluwatife Osineye, Mobile App Developer</span>
          <span>React Native · React · Next.js · Node</span>
        </div>
      </div>
    </section>
  );
}
