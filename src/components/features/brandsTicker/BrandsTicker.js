"use client";
import React from "react";
import Link from "next/link";
import styles from "@/styles/BrandSection.module.css";

const brands = [
  { name: "ویلسون", logo: "/logo/wilson.svg" },
  { name: "یونکس", logo: "/logo/yonex.svg" },
  { name: "تکنیفایبر", logo: "/logo/tecnifibre.svg" },
  { name: "سولینکو", logo: "/logo/solinco.svg" },
  { name: "بابولات", logo: "/logo/babolat.svg" },
  { name: "بولپدل", logo: "/logo/bullpadel.svg" },
  { name: "نوکس", logo: "/logo/nox.svg" },
];

const slugify = (name) => name.trim().replace(/\s+/g, "-");

const BrandSection = () => {
  return (
    <section className={styles.brandSection}>
      <div className={styles.brandTrack}>
        {brands.concat(brands).map((brand, index) => (
          <Link
            key={index}
            href={`/tennis/brand/${slugify(brand.name)}`}
            className={styles.brandLogo}
            title={brand.name}
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className={styles.logoImage}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BrandSection;
