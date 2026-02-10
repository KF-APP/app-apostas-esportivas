import { NextRequest, NextResponse } from 'next/server';

// Forçar rota completamente dinâmica - NUNCA executar no build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email não fornecido' },
        { status: 400 }
      );
    }

    // Verificar se é usuário master
    const MASTER_EMAIL = process.env.MASTER_EMAIL || 'master@palpitepro.com';
    if (email === MASTER_EMAIL) {
      return NextResponse.json({
        success: true,
        hasActiveSubscription: true,
        subscription: {
          email: MASTER_EMAIL,
          plan: 'premium',
          status: 'active',
          isMaster: true,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        },
      });
    }

    // Verificar se Supabase está configurado
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: true,
        hasActiveSubscription: false,
        subscription: null,
      });
    }

    // Tentar verificar assinatura no Supabase
    try {
      const { checkSubscriptionStatus, getSubscriptionByEmail } = await import('@/lib/supabase');
      
      const hasActiveSubscription = await checkSubscriptionStatus(email);
      const subscription = await getSubscriptionByEmail(email);

      return NextResponse.json({
        success: true,
        hasActiveSubscription,
        subscription,
      });
    } catch (supabaseError) {
      // Se falhar ao acessar Supabase, retornar resposta padrão
      console.error('Erro ao acessar Supabase:', supabaseError);
      return NextResponse.json({
        success: true,
        hasActiveSubscription: false,
        subscription: null,
      });
    }
  } catch (error) {
    // Qualquer erro retorna resposta padrão sem falhar
    console.error('Erro na rota subscription/check:', error);
    return NextResponse.json(
      { 
        success: true,
        hasActiveSubscription: false,
        subscription: null,
      },
      { status: 200 }
    );
  }
}
