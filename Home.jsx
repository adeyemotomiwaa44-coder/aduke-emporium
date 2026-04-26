import React from 'react';
import HeroSlideshow from '@/components/store/HeroSlideshow';
import CategoryGrid from '@/components/store/CategoryGrid';
import FeaturedProducts from '@/components/store/FeaturedProducts';
import TrustSection from '@/components/store/TrustSection';

export default function Home() {
  return (
    <>
      <HeroSlideshow />
      <CategoryGrid />
      <FeaturedProducts />
      <TrustSection />
    </>
  );
}
