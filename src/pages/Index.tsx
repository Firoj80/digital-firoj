
import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { LeadQuiz } from "@/components/LeadQuiz";
import { Contact } from "@/components/Contact";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Services />
      <LeadQuiz />
      <Contact />
    </div>
  );
};

export default Index;
