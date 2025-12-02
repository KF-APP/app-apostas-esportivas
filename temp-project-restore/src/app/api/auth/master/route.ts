import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Credenciais master (em produção, use variáveis de ambiente)
const MASTER_EMAIL = process.env.MASTER_EMAIL || 'master@palpitepro.com';
const MASTER_PASSWORD = process.env.MASTER_PASSWORD || 'Master@2024!Secure';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validar credenciais master
    if (email === MASTER_EMAIL && password === MASTER_PASSWORD) {
      const cookieStore = await cookies();
      
      // Criar cookie de autenticação master
      const authData = {
        email: MASTER_EMAIL,
        isMaster: true,
        loginAt: new Date().toISOString()
      };

      cookieStore.set('palpitepro_auth', JSON.stringify(authData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 ano
        path: '/'
      });

      return NextResponse.json({
        success: true,
        message: 'Login master realizado com sucesso',
        user: {
          email: MASTER_EMAIL,
          isMaster: true
        }
      });
    }

    return NextResponse.json(
      { success: false, message: 'Credenciais inválidas' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Erro no login master:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao processar login' },
      { status: 500 }
    );
  }
}
