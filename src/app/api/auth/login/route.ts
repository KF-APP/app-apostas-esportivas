import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('🔐 API Login - Email:', email);

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar assinatura no Supabase
    const supabase = createClient();
    
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions_complete')
      .select('*')
      .eq('user_email', email)
      .single();

    if (fetchError || !subscription) {
      console.error('❌ Assinatura não encontrada:', fetchError);
      return NextResponse.json(
        { error: 'Email não encontrado ou assinatura inválida' },
        { status: 401 }
      );
    }

    // Verificar senha (se existir no banco)
    if (subscription.user_password && subscription.user_password !== password) {
      console.warn('⚠️ Senha incorreta');
      return NextResponse.json(
        { error: 'Senha incorreta' },
        { status: 401 }
      );
    }

    // Verificar status da assinatura
    if (subscription.status !== 'active') {
      console.warn('⚠️ Assinatura não ativa:', subscription.status);
      return NextResponse.json(
        { error: 'Assinatura inativa. Por favor, ative sua assinatura para continuar.' },
        { status: 403 }
      );
    }

    // Verificar expiração
    if (subscription.end_date) {
      const expiresAt = new Date(subscription.end_date);
      const now = new Date();

      if (expiresAt < now) {
        console.warn('⚠️ Assinatura expirada');
        
        // Atualizar status para expirado
        await supabase
          .from('subscriptions_complete')
          .update({ status: 'expired', updated_at: new Date().toISOString() })
          .eq('id', subscription.id);
        
        return NextResponse.json(
          { error: 'Sua assinatura expirou. Por favor, renove seu plano.' },
          { status: 403 }
        );
      }
    }

    // Criar dados de autenticação
    const authData = {
      authenticated: true,
      email: subscription.user_email,
      user: {
        id: subscription.id,
        email: subscription.user_email,
        name: subscription.user_name
      },
      subscription: {
        plan: subscription.plan_type,
        expiresAt: subscription.end_date
      }
    };

    console.log('✅ Login bem-sucedido, setando cookie...');

    // Criar resposta com cookie
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Login realizado com sucesso',
        user: authData.user
      },
      { status: 200 }
    );

    // Setar cookie com dados de autenticação
    response.cookies.set('palpitepro_auth', JSON.stringify(authData), {
      httpOnly: false, // Precisa ser acessível pelo JavaScript para o dashboard
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      path: '/',
    });

    console.log('🍪 Cookie setado com sucesso');

    return response;
  } catch (error) {
    console.error('❌ Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
