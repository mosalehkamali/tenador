'use client';

import { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { ARTICLES } from '@/lib/mockData';

export default function Articles() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              مقالات آموزشی
            </h2>
            <p className="text-gray-400">
              راهنماها و نکات حرفه‌ای برای ارتقای بازی شما
            </p>
          </div>
          <a
            href="/articles"
            className="hidden lg:flex items-center gap-2 text-[#aa4725] hover:text-[#ffbf00] transition-colors font-medium"
          >
            <span>مشاهده همه</span>
            <FiArrowLeft />
          </a>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {/* Large Featured Article */}
          <a
            href={`/article/${ARTICLES[0].slug}`}
            className="relative md:col-span-2 lg:row-span-2 h-[400px] lg:h-[600px] overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHoveredId(ARTICLES[0].id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(13, 13, 13, 0.9), rgba(13, 13, 13, 0.2)), url(${ARTICLES[0].image})`,
              }}
            />
            
            {hoveredId === ARTICLES[0].id && (
              <div className="absolute inset-0 glass-effect pointer-events-none" />
            )}
            
            <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12 diagonal-separator">
              <div className="inline-block mb-4 self-start">
                <span className="px-3 py-1 bg-[#aa4725] text-white text-xs font-bold">
                  مقاله ویژه
                </span>
              </div>
              <h3
                className={`text-2xl lg:text-4xl font-bold mb-3 transition-colors duration-300 ${
                  hoveredId === ARTICLES[0].id ? 'text-[#aa4725]' : 'text-white'
                }`}
              >
                {ARTICLES[0].title}
              </h3>
              <p className="text-gray-300 text-base lg:text-lg max-w-2xl">
                {ARTICLES[0].excerpt}
              </p>
            </div>
          </a>

          {/* Medium Articles */}
          {ARTICLES.slice(1, 4).map((article, index) => (
            <a
              key={article.id}
              href={`/article/${article.slug}`}
              className="relative h-[300px] overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredId(article.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(13, 13, 13, 0.9), rgba(13, 13, 13, 0.2)), url(${article.image})`,
                }}
              />
              
              
              {hoveredId === article.id && (
                <div className="absolute inset-0 glass-effect pointer-events-none" />
              )}
              <div className={`absolute inset-0 flex flex-col justify-end p-6 ${index === 1 ? 'diagonal-separator' : ''}`}>
                <h3
                  className={`text-xl font-bold mb-2 transition-colors duration-300 line-clamp-2 ${
                    hoveredId === article.id ? 'text-[#aa4725]' : 'text-white'
                  }`}
                >
                  {article.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
            </a>
          ))}

          {/* Small Articles */}
          {ARTICLES.slice(4).map((article, index) => (
            <a
              key={article.id}
              href={`/article/${article.slug}`}
              className="relative h-[300px] overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredId(article.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(13, 13, 13, 0.9), rgba(13, 13, 13, 0.2)), url(${article.image})`,
                }}
              />
              
              
              {hoveredId === article.id && (
                <div className="absolute inset-0 glass-effect pointer-events-none" />
              )}
              <div className={`absolute inset-0 flex flex-col justify-end p-6 ${index === 0 ? 'diagonal-separator-reverse' : ''}`}>
                <h3
                  className={`text-xl font-bold mb-2 transition-colors duration-300 line-clamp-2 ${
                    hoveredId === article.id ? 'text-[#aa4725]' : 'text-white'
                  }`}
                >
                  {article.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="text-center mt-8 lg:hidden">
          <a
            href="/articles"
            className="inline-flex items-center gap-2 text-[#aa4725] hover:text-[#ffbf00] transition-colors font-medium"
          >
            <span>مشاهده همه مقالات</span>
            <FiArrowLeft />
          </a>
        </div>
      </div>
    </section>
  );
}
