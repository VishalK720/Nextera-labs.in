import Navbar from "./(landing)/_components/Navbar";
import Hero from "./(landing)/_components/Hero";
import SocialProofStrip from "./(landing)/_components/SocialProofStrip";
import ProblemSection from "./(landing)/_components/ProblemSection";
import CurriculumSection from "./(landing)/_components/CurriculumSection";
import DashboardPreviewSection from "./(landing)/_components/DashboardPreviewSection";
import HowWeSelectSection from "./(landing)/_components/HowWeSelectSection";
import FoundersSection from "./(landing)/_components/FoundersSection";
import TestimonialsSection from "./(landing)/_components/TestimonialsSection";
import ParentSection from "./(landing)/_components/ParentSection";
import PricingSection from "./(landing)/_components/PricingSection";
import ApplySection from "./(landing)/_components/ApplySection";
import Footer from "./(landing)/_components/Footer";
import ChatWidget from "./(landing)/_components/ChatWidget";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SocialProofStrip />
      <ProblemSection />
      <CurriculumSection />
      <DashboardPreviewSection />
      <HowWeSelectSection />
      <FoundersSection />
      <TestimonialsSection />
      <ParentSection />
      <PricingSection />
      <ApplySection />
      <Footer />
      <ChatWidget />
    </>
  );
}
