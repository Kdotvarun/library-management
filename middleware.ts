import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { UserRole } from '@/types';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Allow access to public routes
    if (pathname.startsWith('/api/auth') || pathname === '/signin') {
      return NextResponse.next();
    }

    // Redirect unauthenticated users to signin
    if (!token) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    // Check role-based access
    const userRole = token.role as UserRole;

    // Admin routes - only ADMIN role can access
    if (pathname.startsWith('/admin')) {
      if (userRole !== UserRole.ADMIN) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    // Student routes - only STUDENT role can access
    if (pathname.startsWith('/student')) {
      if (userRole !== UserRole.STUDENT) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    // Redirect authenticated users away from signin page
    if (pathname === '/signin') {
      if (userRole === UserRole.ADMIN) {
        return NextResponse.redirect(new URL('/admin', req.url));
      } else {
        return NextResponse.redirect(new URL('/student', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to public routes
        if (pathname.startsWith('/api/auth') || pathname === '/signin') {
          return true;
        }

        // Require authentication for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
