import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('🧪 Teste de Login - Email:', email);

    const supabase = createClient();
    
    // Tentar autenticar
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('❌ Erro na autenticação:', authError);
      return NextResponse.json({
        success: false,
        error: authError.message,
        details: authError,
      });
    }

    console.log('✅ Autenticação bem-sucedida:', authData.user?.id);

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
      },
    });
  } catch (error) {
    console.error('❌ Erro geral:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
