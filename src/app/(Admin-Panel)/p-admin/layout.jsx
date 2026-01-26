import '@/app/(Site)/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from "@/components/admin/Layout"

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
        <main className="min-h-screen">
        <AdminLayout>{children}</AdminLayout>
        </main>
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
