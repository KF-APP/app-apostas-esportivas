import { NextRequest, NextResponse } from 'next/server';
import { checkSubscriptionStatus, getSubscriptionByEmail } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 ano
        },
      });
    }

    const hasActiveSubscription = await checkSubscriptionStatus(email);
    const subscription = await getSubscriptionByEmail(email);

    return NextResponse.json({
      success: true,
      hasActiveSubscription,
      subscription,
    });
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao verificar assinatura',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
