import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

/**
 * Endpoint para inicializar usuário pré-registrado master
 * Chamado automaticamente na primeira vez que o sistema é acessado
 */
export async function POST() {
  try {
    console.log('🚀 Inicializando usuário pré-registrado master...');
    
    const supabase = createClient();
    
    // Verificar se usuário já existe
    const { data: existing } = await supabase
      .from('subscriptions_complete')
      .select('*')
      .eq('user_email', 'fusquinekaique@hotmail.com')
      .single();
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // +12 meses
    
    if (existing) {
      console.log('🔄 Usuário master já existe, atualizando...');
      
      const { data, error } = await supabase
        .from('subscriptions_complete')
        .update({
          user_name: 'Kaique',
          user_password: 'Kaique24891510*',
          plan_type: 'yearly',
          status: 'active',
          payment_id: 'PRE_REGISTERED_USER',
          payment_method: 'manual',
          amount: 297.00,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_email', 'fusquinekaique@hotmail.com')
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao atualizar usuário master:', error);
        throw error;
      }
      
      console.log('✅ Usuário master atualizado com sucesso!');
      
      return NextResponse.json({
        success: true,
        message: 'Usuário pré-registrado atualizado com sucesso',
        user: data,
      });
    } else {
      console.log('➕ Criando novo usuário master...');
      
      const { data, error } = await supabase
        .from('subscriptions_complete')
        .insert([{
          user_email: 'fusquinekaique@hotmail.com',
          user_name: 'Kaique',
          user_password: 'Kaique24891510*',
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
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('subscriptions_complete')
      .select('*')
      .eq('user_email', 'fusquinekaique@hotmail.com')
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
