import HeroSection from "../../components/home/HeroSection";
import LatestTuitionsSection from "../../components/home/LatestTuitionsSection";
import LatestTutorsSection from "../../components/home/LatestTutorsSection";
import HowItWorksSection from "../../components/home/HowItWorksSection";
import WhyChooseUsSection from "../../components/home/WhyChooseUsSection";

/** Public landing page, rendered inside MainLayout. */
const HomePage = () => {
  return (
    <>
      <HeroSection />
      <LatestTuitionsSection />
      <HowItWorksSection />
      <LatestTutorsSection />
      <WhyChooseUsSection />
    </>
  );
};

export default HomePage;