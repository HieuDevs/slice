import { defineMiddleware } from 'astro:middleware';
import { defaultLang, isValidLanguage } from './i18n';

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

