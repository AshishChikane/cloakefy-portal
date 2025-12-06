import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { SolutionSection } from '@/components/home/SolutionSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { CTASection } from '@/components/home/CTASection';

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <SolutionSection />
      <HowItWorksSection />
      <CTASection />
    </Layout>
  );
}
