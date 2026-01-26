import Hero from '@/components/features/hero/Hero';
import SportsGrid from '@/components/features/sportsGrid/SportsGrid';
import BestSellers from '@/components/features/bestSellers/BestSellers';
import BrandsTicker from '@/components/features/brandsTicker/BrandsTicker';
import AmazingOffers from '@/components/features/amazingOffers/AmazingOffers';
import RolandGarros from '@/components/features/rolandGarros/RolandGarros';
import Articles from '@/components/features/articles/Articles';

export default function Home() {
  return (
    <>
      <Hero />
      <SportsGrid />
      <BestSellers />
      <BrandsTicker />
      <AmazingOffers />
      <RolandGarros />
      {/* <Articles /> */}
    </>
  );
}
