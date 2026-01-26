'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from '@/components/ui/ProductCard';
import { BEST_SELLER_PRODUCTS } from '@/lib/mockData';

export default function BestSellers() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-[#aa4725]/50 to-[#fff]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2">
              پرفروش‌ترین محصولات
            </h2>
            <p className="text-[var(--color-primary)]">
              محبوب‌ترین انتخاب‌های مشتریان ما
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <button className="bestsellers-button-prev w-12 h-12 flex items-center justify-center bg-white/50 border border-black/10 hover:bg-[#aa4725] hover:border-[#aa4725] transition-all duration-300 rounded-full">
              <FiChevronRight className="text-gray-500 text-xl" />
            </button>
            <button className="bestsellers-button-next w-12 h-12 flex items-center justify-center bg-white/50 border border-black/10 hover:bg-[#aa4725] hover:border-[#aa4725] transition-all duration-300 rounded-full">
              <FiChevronLeft className="text-gray-500 text-xl" />
            </button>
          </div>
        </div>

        {/* Products Slider */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          slidesPerGroup={1}
          navigation={{
            nextEl: '.bestsellers-button-next',
            prevEl: '.bestsellers-button-prev',
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              slidesPerGroup: 1,
            },
            768: {
              slidesPerView: 3,
              slidesPerGroup: 1,
            },
            1024: {
              slidesPerView: 4,
              slidesPerGroup: 1,
            },
            1280: {
              slidesPerView: 5,
              slidesPerGroup: 1,
            },
          }}
          className="bestsellers-swiper"
        >
          {BEST_SELLER_PRODUCTS.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
