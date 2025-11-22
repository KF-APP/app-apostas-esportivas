import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSubscriptionStatus } from '@/lib/supabase';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/login', '/checkout'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    const authCookie = request.cookies.get('palpitepro_auth');
    
    if (!authCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const authData = JSON.parse(authCookie.value);
      
      if (!authData.email) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // BYPASS PARA USUÁRIO MASTER - acesso total sem verificar assinatura
      if (authData.isMaster === true) {
        console.log('✅ Acesso master concedido para:', authData.email);
        return NextResponse.next();
      }

      const hasActiveSubscription = await checkSubscriptionStatus(authData.email);
      
      if (!hasActiveSubscription) {
        const response = NextResponse.redirect(new URL('/checkout?expired=true', request.url));
        response.cookies.delete('palpitepro_auth');
        return response;
      }
      
      return NextResponse.next();
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  if (isAuthRoute) {
    const authCookie = request.cookies.get('palpitepro_auth');
    
    if (authCookie) {
      try {
        const authData = JSON.parse(authCookie.value);
        
        if (authData.email) {
          // BYPASS PARA USUÁRIO MASTER - redireciona direto para dashboard
          if (authData.isMaster === true) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
          }

          const hasActiveSubscription = await checkSubscriptionStatus(authData.email);
          
          if (hasActiveSubscription) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/checkout'],
};
