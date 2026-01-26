"use client";

import Button from "@/components/ui/Button";
import { FiArrowLeft } from "react-icons/fi";

export default function RolandGarros() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto rounded-[var(--radius)] shadow-2xl">
        <div className="grid lg:grid-cols-2 gap-0 items-stretch">
          {/* Right Column - Image */}
          <div className="relative h-[400px] lg:h-[600px] overflow-hidden rounded-[var(--radius)]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(13, 13, 13, 0.3), transparent), url('/images/roland-garros.webp')`,
              }}
            />

            {/* Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#aa4725] opacity-20 transform rotate-45 -translate-y-16 translate-x-16" />
          </div>

          {/* Left Column - Content */}
          <div className="p-8 lg:p-16 flex flex-col justify-between rounded-l-[var(--radius)]">
            {/* Badge */}
            <div className="inline-block mb-6">
              <div className="px-4 py-2 bg-[#aa4725]/20 border border-[#aa4725] text-[#aa4725] text-sm font-bold rounded-[var(--radius)]">
                کالکشن ویژه
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              محصولات رولاند گاروس
            </h2>

            {/* Description */}
            <div className="space-y-4 text-gray-600 text-lg mb-8">
              <p>
                کالکشن انحصاری Wilson Roland Garros با طراحی الهام‌گرفته از
                معتبرترین تورنمنت تنیس جهان.
              </p>
              <p>
                راکت‌ها، توپ‌ها و اکسسوری‌های حرفه‌ای با کیفیت برتر و استاندارد
                مسابقات بین‌المللی.
              </p>
              <p>
                تجربه‌ای منحصربه‌فرد از تنیس با محصولات رسمی رولاند گاروس، ساخته
                شده برای قهرمانان.
              </p>
            </div>

            {/* CTA Button */}
            <div>
              <Button
                variant="primary"
                size="lg"
                className="group flex items-center gap-1  rounded-[var(--radius)]"
              >
                <span>مشاهده محصولات</span>
                <FiArrowLeft className="mr-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

          
          </div>
        </div>
      </div>

      {/* Decorative Background Element */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ffbf00] opacity-30 rounded-full blur-3xl" />
    </section>
  );
}
