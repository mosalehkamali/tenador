'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FiChevronLeft, FiChevronRight, FiZap } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from '@/components/ui/ProductCard';
import { AMAZING_OFFER_PRODUCTS } from '@/lib/mockData';

export default function AmazingOffers() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffbf00] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#aa4725] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#aa4725] to-[#ffbf00] flex items-center justify-center">
              <FiZap className="text-white text-3xl" />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-3">
                پیشنهادهای شگفت‌انگیز
              </h2>
              <p className="text-gray-600">
                تخفیف‌های ویژه و محدود تا پایان موجودی
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <button className="amazing-button-prev w-12 h-12 flex items-center justify-center bg-black/30 border border-white/10 hover:bg-[#aa4725] hover:border-[#aa4725] transition-all duration-300 rounded-full">
              <FiChevronRight className="text-white text-xl" />
            </button>
            <button className="amazing-button-next w-12 h-12 flex items-center justify-center bg-black/30 border border-white/10 hover:bg-[#aa4725] hover:border-[#aa4725] transition-all duration-300 rounded-full">
              <FiChevronLeft className="text-white text-xl" />
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
            nextEl: '.amazing-button-next',
            prevEl: '.amazing-button-prev',
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
          className="amazing-swiper"
        >
          {AMAZING_OFFER_PRODUCTS.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* View All Link */}
        <div className="text-center mt-8">
          <a
            href="/amazing-offers"
            className="inline-flex items-center gap-2 text-[#aa4725] hover:text-[#ffbf00] transition-colors font-medium text-lg"
          >
            <span>مشاهده همه پیشنهادها</span>
            <FiChevronLeft />
          </a>
        </div>
      </div>
    </section>
  );
}
