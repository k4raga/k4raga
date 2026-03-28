import { NextResponse } from 'next/server'

export function middleware(request) {
  const host = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  if (host.startsWith('calendar.') && !pathname.startsWith('/calendar') && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
    const url = request.nextUrl.clone()
    url.pathname = '/calendar' + (pathname === '/' ? '' : pathname)
    return NextResponse.rewrite(url)
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
