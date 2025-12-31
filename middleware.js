import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('accessToken')?.value
  if (!token && request.nextUrl.pathname.startsWith('/p-user')) {
    return NextResponse.redirect(new URL('/login-register', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/p-user/:path*',
}
