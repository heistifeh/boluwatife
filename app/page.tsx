import AmbientGradient from "@/components/AmbientGradient";
import HorizonMotion from "@/components/HorizonMotion";
import Nav from "@/components/Nav";
import JumpNav from "@/components/JumpNav";
import Hero from "@/components/sections/Hero";
import ProofBar from "@/components/sections/ProofBar";
import TrackRecord from "@/components/sections/TrackRecord";
import IsdsConnective from "@/components/sections/IsdsConnective";
import ProductSection from "@/components/sections/ProductSection";
import Fitnex from "@/components/sections/Fitnex";
import Cartify from "@/components/sections/Cartify";
import FrontEndToSystem from "@/components/sections/FrontEndToSystem";
import Contact from "@/components/sections/Contact";
import { productSections } from "@/lib/content";

const SITE = "https://boluwatifeosineye.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE}/#person`,
      name: "Boluwatife Osineye",
      alternateName: "Tife",
      jobTitle: "Mobile & Web Engineer",
      url: `${SITE}/`,
      email: "mailto:boluwatife.e.osineye@gmail.com",
      address: { "@type": "PostalAddress", addressCountry: "NG" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "University of Ilorin" },
      knowsAbout: ["React Native", "Expo", "React", "Next.js", "TypeScript", "Node.js", "Supabase", "Firebase"],
      sameAs: ["https://github.com/heistifeh", "https://linkedin.com/in/boluwatifeosineye"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: `${SITE}/`,
      name: "Boluwatife Osineye",
      author: { "@id": `${SITE}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE}/#profile`,
      url: `${SITE}/`,
      name: "Boluwatife Osineye — Mobile & Web Engineer",
      isPartOf: { "@id": `${SITE}/#website` },
      mainEntity: { "@id": `${SITE}/#person` },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Nav />
      <JumpNav />
      <AmbientGradient />
      <HorizonMotion />
      <main id="top" style={{ position: "relative", zIndex: 1 }}>
        <Hero />
        <ProofBar />
        <TrackRecord />
        <IsdsConnective />
        {productSections.map((section) => (
          <ProductSection key={section.name} data={section} />
        ))}
        <Fitnex />
        <Cartify />
        <FrontEndToSystem />
        <Contact />
      </main>
    </>
  );
}
