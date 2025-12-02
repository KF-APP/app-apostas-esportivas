import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

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

    // Usar Admin Client para autenticação (SERVICE_ROLE_KEY)
    const supabase = createAdminClient();
    
    // Autenticar via Supabase Auth usando signInWithPassword
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      console.error('❌ Erro na autenticação:', authError?.message);
      return NextResponse.json(
        { error: 'Email ou senha incorretos' },
        { status: 401 }
      );
    }

    console.log('✅ Autenticação bem-sucedida no Supabase Auth');

    // Buscar assinatura no Supabase (admin client já ignora RLS)
    const { data: subscriptions, error: fetchError } = await supabase
      .from('subscriptions_complete')
      .select('*')
      .eq('user_email', email)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Erro ao buscar assinatura:', fetchError);
      return NextResponse.json(
        { error: 'Erro ao verificar assinatura. Entre em contato com o suporte.' },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.error('❌ Assinatura não encontrada');
      return NextResponse.json(
        { error: 'Assinatura não encontrada. Entre em contato com o suporte.' },
        { status: 403 }
      );
    }

    // Pegar a assinatura mais recente
    const subscription = subscriptions[0];

    console.log('📋 Assinatura encontrada:', {
      id: subscription.id,
      status: subscription.status,
      plan: subscription.plan_type,
      end_date: subscription.end_date
    });

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
    const authDataCookie = {
      authenticated: true,
      email: subscription.user_email,
      user: {
        id: authData.user.id,
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
        user: authDataCookie.user
      },
      { status: 200 }
    );

    // Setar cookie com dados de autenticação
    response.cookies.set('palpitepro_auth', JSON.stringify(authDataCookie), {
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
