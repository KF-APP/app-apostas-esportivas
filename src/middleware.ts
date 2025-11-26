import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = [
    '/', 
    '/login', 
    '/checkout',
    '/success',
    '/api/auth/login', 
    '/api/webhook/pagbank', 
    '/api/subscription/init',
    '/api/subscription/fix-auth'
  ];
  
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Dashboard AGORA REQUER autenticação e assinatura ativa
  if (pathname.startsWith('/dashboard')) {
    const authCookie = request.cookies.get('palpitepro_auth');
    
    if (!authCookie) {
      console.log('🚫 Acesso negado ao dashboard: sem cookie de autenticação');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const authData = JSON.parse(authCookie.value);
      
      if (!authData.authenticated) {
        console.log('🚫 Acesso negado ao dashboard: não autenticado');
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      // Verificar se tem assinatura
      if (!authData.subscription) {
        console.log('🚫 Acesso negado ao dashboard: sem assinatura');
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      // Verificar se assinatura está ativa
      if (authData.subscription.expiresAt) {
        const expiresAt = new Date(authData.subscription.expiresAt);
        const now = new Date();
        
        if (expiresAt < now) {
          console.log('🚫 Acesso negado ao dashboard: assinatura expirada');
          // Assinatura expirada, redirecionar para login
          const response = NextResponse.redirect(new URL('/login', request.url));
          response.cookies.delete('palpitepro_auth');
          return response;
        }
      }
      
      console.log('✅ Acesso permitido ao dashboard: assinatura ativa');
      return NextResponse.next();
    } catch (error) {
      console.error('❌ Erro ao validar autenticação:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Para outras rotas, verificar autenticação
  const authCookie = request.cookies.get('palpitepro_auth');
  
  if (!authCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const authData = JSON.parse(authCookie.value);
    
    if (!authData.authenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Verificar se assinatura está ativa
    if (authData.subscription) {
      const expiresAt = new Date(authData.subscription.expiresAt);
      const now = new Date();
      
      if (expiresAt < now) {
        // Assinatura expirada, redirecionar para login
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('palpitepro_auth');
        return response;
      }
    }
    
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
