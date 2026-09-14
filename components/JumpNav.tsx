"use client";

import { useEffect, useRef, useState } from "react";
import { jumpNavItems } from "@/lib/content";
import styles from "./JumpNav.module.css";

export default function JumpNav() {
  const [active, setActive] = useState("#top");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targets = jumpNavItems
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => !!el);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const href = "#" + e.target.id;
            setActive(href);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={styles.bar}>
      {jumpNavItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={`${styles.pill} ${active === item.href ? styles.pillActive : ""}`}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
