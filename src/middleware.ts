import { defineMiddleware } from 'astro:middleware';
import { defaultLang, isValidLanguage } from '@/i18n';
import { verifyToken, getTokenFromRequest } from './utils/jwt';
import { getUserById } from './db/turso';

const protectedRoutes = ['/internal', '/users', '/app-naming-workshop'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const { request } = context;
  
  // Skip for assets, api routes, and files with extensions
  if (
    pathname.startsWith('/_') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return next();
  }

  // Check if the path already has a language prefix
  const pathSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  
  // If path already has valid language prefix, continue
  if (firstSegment && isValidLanguage(firstSegment)) {
    // Check if this is a protected route
    const routePath = '/' + pathSegments.slice(1).join('/');
    const isProtectedRoute = protectedRoutes.some(route => routePath.startsWith(route));
    
    if (isProtectedRoute) {
      // Verify JWT token from cookie or Authorization header
      let token = getTokenFromRequest(request);
      
      if (!token) {
        token = context.cookies.get('token')?.value || null;
      }
      
      if (!token) {
        const cookieHeader = request.headers.get('cookie');
        if (cookieHeader) {
          const tokenMatch = cookieHeader.match(/token=([^;]+)/);
          if (tokenMatch) {
            token = tokenMatch[1];
          }
        }
      }
      
      const payload = await verifyToken(token);
      
      if (!payload) {
        // Not authenticated - redirect to login
        const loginPath = `/${firstSegment}/login`;
        return context.redirect(loginPath, 302);
      }
      
      // Store user info in context.locals for use in pages
      const user = await getUserById(payload.id);
      if (user) {
        context.locals.user = {
          id: user.id,
          username: user.username,
          role: user.role,
        };
      } else {
        // User not found - redirect to login
        const loginPath = `/${firstSegment}/login`;
        return context.redirect(loginPath, 302);
      }
    }
    
    return next();
  }

  // No language prefix - redirect based on cookie or default
  // Middleware runs server-side, so reading headers is OK here
  const cookie = request.headers.get('cookie');
  const langMatch = cookie?.match(/preferred-language=([^;]+)/);
  const preferredLang = langMatch?.[1];
  
  // Use cookie language if valid, otherwise default
  const targetLang = preferredLang && isValidLanguage(preferredLang) 
    ? preferredLang 
    : defaultLang;
  
  // Redirect to language-prefixed path
  const newPath = pathname === '/' ? `/${targetLang}` : `/${targetLang}${pathname}`;
  return context.redirect(newPath, 302);
});

