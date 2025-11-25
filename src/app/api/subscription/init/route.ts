import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

/**
 * Endpoint para criar usuário pendente durante o checkout
 * Usuário será ativado após confirmação do pagamento
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password, plan } = body;

    console.log('🚀 Criando usuário pendente:', { email, name, plan });
    
    if (!email || !name || !password || !plan) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    
    // Verificar se usuário já existe
    const { data: existing } = await supabase
      .from('subscriptions_complete')
      .select('*')
      .eq('user_email', email)
      .single();
    
    if (existing) {
      // Se já existe, atualizar com novos dados
      console.log('🔄 Usuário já existe, atualizando...');
      
      const { data, error } = await supabase
        .from('subscriptions_complete')
        .update({
          user_name: name,
          user_password: password,
          plan_type: plan,
          status: 'pending', // Status pendente até confirmação do pagamento
          updated_at: new Date().toISOString(),
        })
        .eq('user_email', email)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao atualizar usuário:', error);
        throw error;
      }
      
      console.log('✅ Usuário atualizado com sucesso!');
      
      return NextResponse.json({
        success: true,
        message: 'Usuário atualizado com sucesso',
        user: data,
      });
    } else {
      // Criar novo usuário pendente
      console.log('➕ Criando novo usuário pendente...');
      
      const { data, error } = await supabase
        .from('subscriptions_complete')
        .insert([{
          user_email: email,
          user_name: name,
          user_password: password,
          plan_type: plan,
          status: 'pending', // Status pendente até confirmação do pagamento
          payment_id: null,
          payment_method: null,
          amount: plan === 'yearly' ? 297.00 : 29.90,
          start_date: null,
          end_date: null,
        }])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao criar usuário:', error);
        throw error;
      }
      
      console.log('✅ Usuário pendente criado com sucesso!');
      
      return NextResponse.json({
        success: true,
        message: 'Usuário criado com sucesso',
        user: data,
      });
    }
  } catch (error) {
    console.error('❌ Erro ao processar usuário:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao processar usuário', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * Endpoint GET para verificar status de usuário
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email não fornecido' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('subscriptions_complete')
      .select('*')
      .eq('user_email', email)
      .single();
    
    if (error || !data) {
      return NextResponse.json({
        exists: false,
        message: 'Usuário não encontrado',
      });
    }
    
    return NextResponse.json({
      exists: true,
      user: {
        email: data.user_email,
        name: data.user_name,
        plan: data.plan_type,
        status: data.status,
        expiresAt: data.end_date,
      },
    });
  } catch (error) {
    console.error('❌ Erro ao verificar usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar usuário' },
      { status: 500 }
    );
  }
}
