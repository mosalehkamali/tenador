"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { HERO_SLIDES } from "@/lib/mockData";

export default function Hero() {
  return (
    <section className="relative w-full h-[500px] lg:h-[600px] overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d]">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: ".hero-pagination",
          bulletClass: "hero-bullet",
          bulletActiveClass: "hero-bullet-active",
        }}
        navigation={{
          nextEl: ".hero-button-next",
          prevEl: ".hero-button-prev",
        }}
        className="h-full"
      >
        {HERO_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Background Image with Gradient Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(13, 13, 13, 0.7), transparent), url(${slide.image})`,
                }}
              />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-end">
                <div className="container mx-auto px-4 lg:px-8 pb-20 lg:pb-24">
                  <div className="max-w-2xl">
                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 drop-shadow-2xl">
                      {slide.title}
                    </h2>
                    <p className="text-lg lg:text-xl text-gray-200 drop-shadow-lg">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <button className="hero-button-prev absolute top-1/2 right-0 lg:right-0 -translate-y-1/2 z-10 w-25 h-full flex items-center justify-center opacity-0 hover:bg-white/10 hover:opacity-100 transition-all duration-300 group">
        <FiChevronRight className="text-[#aa4725] text-5xl" />
      </button>

      <button className="hero-button-next absolute top-1/2 left-0 lg:left-0 -translate-y-1/2 z-10 w-25 h-full flex items-center justify-center opacity-0 hover:bg-white/10 hover:opacity-100 transition-all duration-300 group">
        <FiChevronLeft className="text-[#aa4725] text-5xl" />
      </button>

      {/* Pagination */}
      <div className="absolute bottom-8 inset-x-0 z-10">
        <div className="hero-pagination mx-auto flex w-fit gap-3" />
      </div>

      <style jsx global>{`
        .hero-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .hero-bullet-active {
          width: 40px;
          background: #aa4725;
        }

        .hero-bullet:hover {
          background: rgba(170, 71, 37, 0.7);
        }
      `}</style>
    </section>
  );
}
