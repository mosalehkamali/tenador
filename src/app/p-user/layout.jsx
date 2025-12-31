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
    <div className="min-h-screen bg-gray-50 rtl">
      {children}
    </div>
  )
}
