import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/features/navbar/Navbar';
import Footer from '@/components/features/footer/Footer';

export const metadata = {
  title: 'فروشگاه ورزشی تنادور',
  description: 'فروشگاه تخصصی محصولات تنیس، پدل، اسکواش، بدمینتون و پینگ‌پنگ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa-IR" dir="rtl">
      <head>
        <link 
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" 
          rel="stylesheet" 
          type="text/css" 
        />
      </head>
      <body className="bg-[var(--color-background)] text-[var(--color-text)]">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ToastContainer
           position="top-left"
           autoClose={3000}
           hideProgressBar={false}
           newestOnTop={false}
           closeOnClick
           rtl={true}
           pauseOnFocusLoss
           draggable
           pauseOnHover
        />
      </body>
    </html>
  );
}
