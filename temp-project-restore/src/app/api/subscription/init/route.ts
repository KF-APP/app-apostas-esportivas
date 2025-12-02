import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, plan } = await request.json();

    console.log('🚀 Iniciando criação de usuário:', { email, name, plan });

    // Validação
    if (!email || !password || !name || !plan) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    // 1. CRIAR USUÁRIO NO SUPABASE AUTH
    console.log('📝 Criando usuário no Supabase Auth...');
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        name: name
      }
    });

    if (authError) {
      console.error('❌ Erro ao criar usuário no Auth:', authError);
      return NextResponse.json(
        { error: `Erro ao criar usuário: ${authError.message}` },
        { status: 500 }
      );
    }

    console.log('✅ Usuário criado no Auth:', authData.user.id);

    // 2. CRIAR ASSINATURA NA TABELA
    const startDate = new Date();
    const endDate = new Date();
    
    if (plan === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    console.log('📝 Criando assinatura na tabela...');
    const { data: subscription, error: subError } = await adminSupabase
      .from('subscriptions_complete')
      .insert({
        user_email: email,
        user_name: name,
        plan_type: plan,
        status: 'active',
        payment_id: `INIT_${Date.now()}`,
        payment_method: 'manual',
        amount: plan === 'yearly' ? '297.00' : '29.90',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      })
      .select()
      .single();

    if (subError) {
      console.error('❌ Erro ao criar assinatura:', subError);
      
      // Reverter criação do usuário no Auth
      await adminSupabase.auth.admin.deleteUser(authData.user.id);
      
      return NextResponse.json(
        { error: `Erro ao criar assinatura: ${subError.message}` },
        { status: 500 }
      );
    }

    console.log('✅ Assinatura criada com sucesso!');

    return NextResponse.json({
      success: true,
      message: 'Usuário criado com sucesso!',
      user: {
        id: authData.user.id,
        email: email,
        name: name
      },
      subscription: {
        plan: plan,
        status: 'active',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Erro geral:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
