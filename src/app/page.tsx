import MainLayout from "@/components/MainLayout"
import Hero from "./components/Heor"
import HowItWorks from "./components/HowItWorks"
import FeatureRows from "./components/FeatureRows"
import MoreTools from "./components/MoreTools"
import FinalCta from "./components/FinalCta"

const LandingPage = () => {

  return (
    <MainLayout>
      <>
        <Hero image="/images/landing/Landing_Hero_ image.png" />
        <HowItWorks />
        <FeatureRows />
        <MoreTools />
        <FinalCta />
      </>
    </MainLayout>
  )
}

export default LandingPage