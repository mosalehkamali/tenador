'use client';

import { useState } from 'react';
import { SPORTS_CATEGORIES } from '@/lib/constants';

const ALL_CATEGORIES = [...SPORTS_CATEGORIES];

export default function   SportsGrid() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-[#fff] to-[#aa4725]/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center">
          دسته‌بندی ورزشی
        </h2>

        {/* Irregular Grid Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
          {/* Large Item - Tennis */}
          <a
            href={`/category/${ALL_CATEGORIES[0].slug}`}
            className="relative col-span-2 row-span-2 h-[400px] lg:h-[500px] overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHoveredId(ALL_CATEGORIES[0].id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(13, 13, 13, 0.8), rgba(13, 13, 13, 0.3)), url(${ALL_CATEGORIES[0].image})`,
              }}
            />
            {hoveredId === ALL_CATEGORIES[0].id && (
              <div className="absolute inset-0 glass-effect pointer-events-none" />
            )}
            <div className="absolute inset-0 flex items-end p-8 diagonal-separator">
              <h3
                className={`text-3xl lg:text-4xl font-bold transition-colors duration-300 ${
                  hoveredId === ALL_CATEGORIES[0].id ? 'text-[#aa4725]' : 'text-white'
                }`}
              >
                {ALL_CATEGORIES[0].name}
              </h3>
            </div>
          </a>

          {/* Medium Items - Padel, Squash */}
          {[ALL_CATEGORIES[1], ALL_CATEGORIES[2]].map((category, index) => (
            <a
              key={category.id}
              href={`/category/${category.slug}`}
              className="relative h-[200px] lg:h-[250px] overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(13, 13, 13, 0.8), rgba(13, 13, 13, 0.3)), url(${category.image})`,
                }}
              />
              {hoveredId === category.id && (
                <div className="absolute inset-0 glass-effect pointer-events-none" />
              )}
              <div className={`absolute inset-0 flex items-end p-6 ${index === 0 ? 'diagonal-separator' : 'diagonal-separator-reverse'}`}>
                <h3
                  className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${
                    hoveredId === category.id ? 'text-[#aa4725]' : 'text-white'
                  }`}
                >
                  {category.name}
                </h3>
              </div>
            </a>
          ))}

          {/* Small Items - Badminton, Pingpong, General, Accessories */}
          {[ALL_CATEGORIES[3], ALL_CATEGORIES[4]].map((category, index) => (
            <a
              key={category.id}
              href={`/category/${category.slug}`}
              className="relative h-[200px] lg:h-[250px] overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(13, 13, 13, 0.8), rgba(13, 13, 13, 0.3)), url(${category.image})`,
                }}
              />
              {hoveredId === category.id && (
                <div className="absolute inset-0 glass-effect pointer-events-none" />
              )}
              <div className={`absolute inset-0 flex items-end p-6 ${index % 2 === 0 ? 'diagonal-separator' : ''}`}>
                <h3
                  className={`text-xl lg:text-2xl font-bold transition-colors duration-300 ${
                    hoveredId === category.id ? 'text-[#aa4725]' : 'text-white'
                  }`}
                >
                  {category.name}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
