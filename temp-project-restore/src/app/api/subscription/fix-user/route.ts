import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const adminSupabase = createAdminClient();

    // Criar usuário no Supabase Auth
    console.log('📝 Criando usuário fusquinekaique@hotmail.com no Auth...');
    
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email: 'fusquinekaique@hotmail.com',
      password: 'Kaique24891510*',
      email_confirm: true,
      user_metadata: {
        name: 'Kaique Fusquine'
      }
    });

    if (authError) {
      console.error('❌ Erro ao criar usuário:', authError);
      return NextResponse.json(
        { error: `Erro: ${authError.message}` },
        { status: 500 }
      );
    }

    console.log('✅ Usuário criado com sucesso no Auth!');

    return NextResponse.json({
      success: true,
      message: 'Usuário criado no Supabase Auth com sucesso!',
      user: {
        id: authData.user.id,
        email: authData.user.email
      }
    });

  } catch (error) {
    console.error('❌ Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
