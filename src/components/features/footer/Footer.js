'use client';

import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';
import { FaTelegram } from 'react-icons/fa';
import { FOOTER_SECTIONS } from '@/lib/constants';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function Footer() {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    toast.success('با موفقیت در خبرنامه عضو شدید', {
      position: 'top-left',
    });
  };

  return (
    <footer className="border-t border-black/20">
      {/* Newsletter Section */}
      <div className="border-b border-black/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  عضویت در خبرنامه
                </h3>
                <p className="text-gray-600">
                  از جدیدترین محصولات و تخفیف‌های ویژه با خبر شوید
                </p>
              </div>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                <Input
                  type="email"
                  placeholder="ایمیل خود را وارد کنید"
                  required
                  className="flex-grow"
                />
                <Button type="submit" variant="primary">
                  عضویت
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-[#aa4725] mb-4">
              <Image src="/logo/logo.svg" alt="logo" width={100} height={100} />
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              فروشگاه تخصصی تجهیزات ورزش‌های راکتی در ایران. 
              ارائه‌دهنده محصولات اصل و با کیفیت برندهای معتبر جهانی 
              با بهترین قیمت و خدمات پس از فروش.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-black transition-colors">
                <FiPhone className="text-[#aa4725]" size={20} />
                <span>021-12345678</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-black transition-colors">
                <FiMail className="text-[#aa4725]" size={20} />
                <span>info@racketsport.ir</span>
              </div>
              <div className="flex items-start gap-3 text-gray-600 cursor-pointer hover:text-black transition-colors">
                <FiMapPin className="text-[#aa4725] flex-shrink-0 mt-1" size={20} />
                <span>تهران، خیابان ولیعصر، پلاک 123، طبقه 2</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-black/20 border border-black/10 hover:bg-[#aa4725] hover:border-[#aa4725] transition-all duration-300 rounded-[var(--radius)]"
              >
                <FiInstagram size={20} />
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-black/20 border border-black/10 hover:bg-[#aa4725] hover:border-[#aa4725] transition-all duration-300 rounded-[var(--radius)]"
              >
                <FaTelegram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-black/20 border border-black/10 hover:bg-[#aa4725] hover:border-[#aa4725] transition-all duration-300 rounded-[var(--radius)]"
              >
                <FiTwitter size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-black/20 border border-black/10 hover:bg-[#aa4725] hover:border-[#aa4725] transition-all duration-300 rounded-[var(--radius)] "
              >
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Footer Links Columns */}
          {FOOTER_SECTIONS.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-bold mb-4 pb-2 border-b border-[#aa4725]">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-[#aa4725] transition-colors block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-end gap-4 text-sm text-gray-600">
            <div className="flex gap-6">
              <a href="/terms" className="hover:text-black transition-colors">
                قوانین و مقررات
              </a>
              <a href="/privacy" className="hover:text-black transition-colors">
                حریم خصوصی
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
