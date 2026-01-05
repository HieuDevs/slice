export function getCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const cookie = cookieHeader.split(';').find(c => c.trim().startsWith(`${name}=`));
  return cookie ? cookie.split('=')[1]?.trim() || null : null;
}

