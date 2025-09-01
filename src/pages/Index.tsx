
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/Portfolio";
import { LeadQuiz } from "@/components/LeadQuiz";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Services />
      <Portfolio />
      <LeadQuiz />
      <Contact />
    </div>
  );
};

export default Index;
