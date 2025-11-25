import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authRoutes = ['/login', '/checkout'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Redirecionar usuários autenticados que tentam acessar páginas de login
  if (isAuthRoute) {
    const authCookie = request.cookies.get('palpitepro_auth');
    
    if (authCookie) {
      try {
        const authData = JSON.parse(authCookie.value);
        
        if (authData.authenticated && authData.email) {
          console.log('✅ Usuário já autenticado - redirecionando para /dashboard');
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch (error) {
        console.error('❌ Erro ao verificar cookie em rota de auth:', error);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/checkout'],
};
