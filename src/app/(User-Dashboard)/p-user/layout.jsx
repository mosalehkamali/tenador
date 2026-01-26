import '@/app/(Site)/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from 'base/utils/auth'

export default async function UserDashboardLayout({ children }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('accessToken')?.value

  if (!token) {
    redirect('/login-register')
  }

  const user = verifyToken(token)
  if (!user) {
    redirect('/login-register')
  }

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
        {children}
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