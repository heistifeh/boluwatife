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

export default function Page() {
  return (
    <>
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
