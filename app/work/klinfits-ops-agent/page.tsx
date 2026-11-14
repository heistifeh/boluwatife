import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AmbientGradient from "@/components/AmbientGradient";
import Glow from "@/components/Glow";
import { klinfits, klinfitsCaseStudy as cs } from "@/lib/content";
import styles from "./page.module.css";

const title = "Klinfits ops agent — Boluwatife Osineye";
const description =
  "Case study: an AI operations agent for my own clothing shop. It turns a pasted WhatsApp order into a priced payment link that I approve with one tap.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/work/klinfits-ops-agent" },
  openGraph: { type: "article", url: "/work/klinfits-ops-agent", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function KlinfitsCaseStudy() {
  return (
    <>
      <AmbientGradient />
      <header className={styles.header}>
        <Link href="/" className={`${styles.home} font-display`}>
          Boluwatife Osineye
        </Link>
        <Link href="/#work" className={styles.back}>
          Back to work
        </Link>
      </header>
      <main className={styles.main}>
        <div className={styles.hero}>
          <Glow spec={klinfits.glow} />
          <div className={styles.heroInner}>
            <div className={styles.eyebrow}>{klinfits.eyebrow}</div>
            <h1 className={`${styles.title} font-display`}>{cs.title}</h1>
            <p className={styles.subtitle}>{cs.subtitle}</p>
            <div className={styles.heroActions}>
              <a href={cs.link.href} target="_blank" rel="noopener noreferrer" className={styles.cta}>
                {cs.link.label}
              </a>
            </div>
          </div>
        </div>

        <article className={styles.article}>
          <section className={styles.block}>
            <h2 className={`${styles.h2} font-display`}>{cs.context.heading}</h2>
            <p className={styles.p}>{cs.context.body}</p>
            <figure className={styles.figure}>
              <div className={styles.frame}>
                <Image
                  src={cs.context.image.src}
                  alt={cs.context.image.alt}
                  width={cs.context.image.width}
                  height={cs.context.image.height}
                  sizes="(max-width: 699px) 100vw, 760px"
                  className={styles.img}
                  priority
                />
              </div>
            </figure>
          </section>

          <section className={styles.block}>
            <h2 className={`${styles.h2} font-display`}>{cs.problem.heading}</h2>
            {cs.problem.body.map((p) => (
              <p key={p} className={styles.p}>
                {p}
              </p>
            ))}
          </section>

          <section className={styles.block}>
            <h2 className={`${styles.h2} font-display`}>{cs.built.heading}</h2>
            <ol className={styles.steps}>
              {cs.built.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className={styles.p}>{cs.built.note}</p>
          </section>

          <section className={styles.block}>
            <h2 className={`${styles.h2} font-display`}>{cs.safety.heading}</h2>
            <p className={`${styles.rule} font-display`}>{cs.safety.rule}</p>
            <ul className={styles.list}>
              {cs.safety.points.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>

          <section className={styles.block}>
            <h2 className={`${styles.h2} font-display`}>{cs.example.heading}</h2>
            <p className={styles.meta}>{cs.example.when}</p>
            <p className={styles.p}>{cs.example.inputLabel}</p>
            <blockquote className={styles.quote}>{cs.example.input}</blockquote>
            <p className={styles.p}>{cs.example.resultLabel}</p>
            <ul className={styles.list}>
              {cs.example.results.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <figure className={styles.figure}>
              <div className={styles.frame}>
                <Image
                  src={cs.exampleImage.src}
                  alt={cs.exampleImage.alt}
                  width={cs.exampleImage.width}
                  height={cs.exampleImage.height}
                  sizes="(max-width: 699px) 100vw, 760px"
                  className={styles.img}
                  loading="lazy"
                />
              </div>
              <figcaption className={styles.caption}>{cs.example.caption}</figcaption>
            </figure>
          </section>

          <section className={styles.block}>
            <h2 className={`${styles.h2} font-display`}>{cs.numbers.heading}</h2>
            <dl className={styles.numbers}>
              {cs.numbers.items.map((n) => (
                <div key={n.label} className={styles.number}>
                  <dt className={styles.numberLabel}>{n.label}</dt>
                  <dd className={`${styles.numberValue} font-display`}>{n.value}</dd>
                  <dd className={styles.numberNote}>{n.note}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={styles.block}>
            <h2 className={`${styles.h2} font-display`}>{cs.flow.heading}</h2>
            <ol className={styles.flow}>
              {cs.flow.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </section>

          <section className={styles.block}>
            <h2 className={`${styles.h2} font-display`}>{cs.stack.heading}</h2>
            <ul className={styles.tags}>
              {cs.stack.tags.map((t) => (
                <li key={t} className={styles.tag}>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.block}>
            <div className={styles.headingRow}>
              <h2 className={`${styles.h2} font-display`}>{cs.next.heading}</h2>
              <span className={styles.badge}>{cs.next.note}</span>
            </div>
            <ul className={styles.list}>
              {cs.next.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>

          <div className={styles.actions}>
            <a href={cs.link.href} target="_blank" rel="noopener noreferrer" className={styles.cta}>
              {cs.link.label}
            </a>
            <Link href="/#work" className={styles.secondary}>
              Back to work
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
