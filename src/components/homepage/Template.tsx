import React from "react";
import Hero from "./new/Hero";
import Services from "./new/Services";
import About from "./new/About";
import BeforeAfter from "./new/BeforeAfter";
import Contact from "./new/Contacts";
import HeroSection from "./new/HeroSection";
import Navigation from "./new/Navigation";

const Template = () => {
  return (
    <>
      <Navigation />
      <HeroSection />
      <Services />
      <About />
      <BeforeAfter />
      <Contact />
    </>
  );
};

export default Template;
