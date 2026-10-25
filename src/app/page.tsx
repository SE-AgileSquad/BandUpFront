import MainLayout from "@/components/MainLayout"
import Hero from "@/features/landing/components/Heor"
import HowItWorks from "@/features/landing/components/HowItWorks"
import FeatureRows from "@/features/landing/components/FeatureRows"
import MoreTools from "@/features/landing/components/MoreTools"
import FinalCta from "@/features/landing/components/FinalCta"

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