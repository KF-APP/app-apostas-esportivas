import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

/**
 * Endpoint para inicializar usuário pré-registrado master
 * Chamado automaticamente na primeira vez que o sistema é acessado
 * USA SERVICE_ROLE_KEY para ignorar RLS
 */
export async function POST() {
  try {
    console.log('🚀 Inicializando usuário pré-registrado master...');
    
    const supabase = createAdminClient();
    
    // Verificar se usuário já existe no Auth
    const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Erro ao listar usuários:', listError);
    }
    
    const existingAuthUser = authUsers?.users?.find(u => u.email === 'fusquinekaique@hotmail.com');
    
    if (existingAuthUser) {
      console.log('🔄 Usuário já existe no Auth (ID:', existingAuthUser.id, '), atualizando senha...');
      
      // Atualizar senha do usuário existente
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingAuthUser.id,
        {
          password: 'Kaique24891510*',
          email_confirm: true,
          user_metadata: {
            name: 'Kaique',
          }
        }
      );
      
      if (updateError) {
        console.error('❌ Erro ao atualizar usuário no Auth:', updateError);
      } else {
        console.log('✅ Senha atualizada no Supabase Auth');
      }
    } else {
      console.log('➕ Criando novo usuário no Auth...');
      
      // Criar usuário no Supabase Auth usando SERVICE_ROLE_KEY
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'fusquinekaique@hotmail.com',
        password: 'Kaique24891510*',
        email_confirm: true, // Confirmar email automaticamente
        user_metadata: {
          name: 'Kaique',
        }
      });
      
      if (authError) {
        console.error('❌ Erro ao criar usuário no Auth:', authError);
      } else {
        console.log('✅ Usuário criado no Supabase Auth:', authData.user?.id);
      }
    }
    
    // Verificar se usuário já existe na tabela subscriptions_complete
    const { data: existing } = await supabase
      .from('subscriptions_complete')
      .select('*')
      .eq('user_email', 'fusquinekaique@hotmail.com')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // +12 meses
    
    if (existing) {
      console.log('🔄 Usuário master já existe na tabela (ID:', existing.id, '), atualizando...');
      
      const { data, error } = await supabase
        .from('subscriptions_complete')
        .update({
          user_name: 'Kaique',
          plan_type: 'yearly',
          status: 'active',
          payment_id: 'PRE_REGISTERED_USER',
          payment_method: 'manual',
          amount: 297.00,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao atualizar usuário master:', error);
        throw error;
      }
      
      console.log('✅ Usuário master atualizado com sucesso!');
      console.log('📅 Data de início:', startDate.toISOString());
      console.log('📅 Data de expiração:', endDate.toISOString());
      
      return NextResponse.json({
        success: true,
        message: 'Usuário pré-registrado atualizado com sucesso',
        user: data,
      });
    } else {
      console.log('➕ Criando novo registro na tabela...');
      
      // Criar registro na tabela subscriptions_complete
      const { data, error } = await supabase
        .from('subscriptions_complete')
        .insert([{
          user_email: 'fusquinekaique@hotmail.com',
          user_name: 'Kaique',
          plan_type: 'yearly',
          status: 'active',
          payment_id: 'PRE_REGISTERED_USER',
          payment_method: 'manual',
          amount: 297.00,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        }])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao criar usuário master:', error);
        throw error;
      }
      
      console.log('✅ Usuário master criado com sucesso!');
      console.log('📅 Data de início:', startDate.toISOString());
      console.log('📅 Data de expiração:', endDate.toISOString());
      
      return NextResponse.json({
        success: true,
        message: 'Usuário pré-registrado criado com sucesso',
        user: data,
      });
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar usuário master:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao inicializar usuário', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * Endpoint GET para verificar se usuário pré-registrado existe
 */
export async function GET() {
  try {
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from('subscriptions_complete')
      .select('*')
      .eq('user_email', 'fusquinekaique@hotmail.com')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      return NextResponse.json({
        exists: false,
        message: 'Usuário pré-registrado não encontrado',
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
