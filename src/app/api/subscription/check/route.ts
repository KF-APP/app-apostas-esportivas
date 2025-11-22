import { NextRequest, NextResponse } from 'next/server';
import { checkSubscriptionStatus, getSubscriptionByEmail } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  
  if (!email) {
    return NextResponse.json(
      { error: 'Email não fornecido' },
      { status: 400 }
    );
  }

  try {
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
      { error: 'Erro ao verificar assinatura' },
      { status: 500 }
    );
  }
}
