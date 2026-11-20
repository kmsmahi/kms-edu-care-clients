import HeroSection from "../../Components/Home/HeroSection";
import LatestTuitionsSection from "../../Components/Home/LatestTuitionsSection";
import LatestTutorsSection from "../../Components/Home/LatestTutorsSection";
import HowItWorksSection from "../../Components/Home/HowItWorksSection";
import WhyChooseUsSection from "../../Components/Home/WhyChooseUsSection";

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