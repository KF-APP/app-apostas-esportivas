import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/login', '/checkout'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Proteger rotas que precisam de autenticação
  if (isProtectedRoute) {
    const authCookie = request.cookies.get('palpitepro_auth');
    
    console.log('🔒 Middleware - Rota protegida:', pathname);
    console.log('🍪 Cookie presente:', !!authCookie);
    
    if (!authCookie) {
      console.log('❌ Sem cookie - redirecionando para /login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const authData = JSON.parse(authCookie.value);
      
      console.log('✅ Cookie válido:', { email: authData.email, authenticated: authData.authenticated });
      
      // Verificar se tem dados básicos de autenticação
      if (!authData.authenticated || !authData.email) {
        console.log('❌ Cookie inválido - redirecionando para /login');
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // BYPASS PARA USUÁRIO MASTER - acesso total
      if (authData.isMaster === true) {
        console.log('✅ Acesso master concedido para:', authData.email);
        return NextResponse.next();
      }

      // Se chegou aqui, o cookie é válido e foi setado pela API de login
      // que já validou a assinatura no Supabase
      console.log('✅ Acesso permitido ao dashboard');
      return NextResponse.next();
      
    } catch (error) {
      console.error('❌ Erro ao verificar cookie:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
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
  matcher: ['/dashboard/:path*', '/login', '/checkout'],
};
