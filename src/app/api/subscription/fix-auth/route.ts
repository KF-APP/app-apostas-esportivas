import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

/**
 * Endpoint para corrigir usuários que existem na tabela subscriptions_complete
 * mas não existem no Supabase Auth
 * USA SERVICE_ROLE_KEY para ignorar RLS
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔧 Corrigindo autenticação para:', email);
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    
    // Verificar se usuário existe na tabela subscriptions_complete (pegar o mais recente)
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions_complete')
      .select('*')
      .eq('user_email', email)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (subError || !subscriptions || subscriptions.length === 0) {
      console.error('❌ Usuário não encontrado na tabela subscriptions_complete:', subError);
      return NextResponse.json(
        { error: 'Usuário não encontrado no sistema' },
        { status: 404 }
      );
    }
    
    const subscription = subscriptions[0];
    console.log('✅ Usuário encontrado na tabela:', subscription.user_name);
    
    // Verificar se usuário já existe no Auth
    const { data: existingAuthUser } = await supabase.auth.admin.listUsers();
    const userExists = existingAuthUser.users.find(u => u.email === email);
    
    if (userExists) {
      console.log('⚠️ Usuário já existe no Supabase Auth, atualizando senha...');
      
      // Atualizar senha do usuário existente
      const { data: authData, error: updateError } = await supabase.auth.admin.updateUserById(
        userExists.id,
        { password: password }
      );
      
      if (updateError) {
        console.error('❌ Erro ao atualizar senha:', updateError);
        throw updateError;
      }
      
      console.log('✅ Senha atualizada com sucesso!');
      
      return NextResponse.json({
        success: true,
        message: 'Senha atualizada com sucesso',
        user: {
          email: subscription.user_email,
          name: subscription.user_name,
          plan: subscription.plan_type,
          status: subscription.status,
        },
      });
    } else {
      console.log('➕ Criando usuário no Supabase Auth...');
      
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Confirmar email automaticamente
        user_metadata: {
          name: subscription.user_name,
        }
      });
      
      if (authError) {
        console.error('❌ Erro ao criar usuário no Auth:', authError);
        throw authError;
      }
      
      console.log('✅ Usuário criado no Supabase Auth:', authData.user?.id);
      
      return NextResponse.json({
        success: true,
        message: 'Usuário criado no sistema de autenticação com sucesso',
        user: {
          email: subscription.user_email,
          name: subscription.user_name,
          plan: subscription.plan_type,
          status: subscription.status,
        },
      });
    }
  } catch (error) {
    console.error('❌ Erro ao corrigir autenticação:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao corrigir autenticação', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * Endpoint GET para verificar status de autenticação
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

    const supabase = createAdminClient();
    
    // Verificar na tabela subscriptions_complete (pegar o mais recente)
    const { data: subscriptions } = await supabase
      .from('subscriptions_complete')
      .select('*')
      .eq('user_email', email)
      .order('created_at', { ascending: false })
      .limit(1);
    
    const subscription = subscriptions && subscriptions.length > 0 ? subscriptions[0] : null;
    
    // Verificar no Auth
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const authUser = authUsers.users.find(u => u.email === email);
    
    return NextResponse.json({
      existsInSubscriptions: !!subscription,
      existsInAuth: !!authUser,
      subscription: subscription ? {
        email: subscription.user_email,
        name: subscription.user_name,
        plan: subscription.plan_type,
        status: subscription.status,
        expiresAt: subscription.end_date,
      } : null,
      needsFix: !!subscription && !authUser,
    });
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar status' },
      { status: 500 }
    );
  }
}
