import React from "react";
import Hero from "./new/Hero";
import Services from "./new/Services";
import About from "./new/About";
import BeforeAfter from "./new/BeforeAfter";
import Contact from "./new/Contacts";
import HeroSection from "./new/HeroSection";
import NewHeroSection from "../../pages/vizualizer/HeroSection";
import Navigation from "./new/Navigation";
import WorkflowSection from "@/pages/vizualizer/WorkflowSection";
import DemoSection from "@/pages/vizualizer/DemoSection";

const Template = () => {
  return (
    <>
      <Navigation />

      <HeroSection />
      <NewHeroSection />
      {/* <WorkflowSection /> */}
      <DemoSection />
      <Services />
      <About />
      <BeforeAfter />
      <Contact />
    </>
  );
};

export default Template;
