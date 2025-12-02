import { createClient, createAdminClient } from '@/lib/supabase';

async function testLogin() {
  try {
    console.log('🔐 Testando login...');
    
    const email = 'fusquinekaique@hotmail.com';
    const password = 'Kaique24891510*';
    
    // Teste 1: Autenticar via Supabase Auth
    console.log('\n1️⃣ Testando autenticação no Supabase Auth...');
    const supabase = createClient();
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (authError) {
      console.error('❌ Erro na autenticação:', authError);
      return;
    }
    
    console.log('✅ Autenticação bem-sucedida!');
    console.log('User ID:', authData.user.id);
    console.log('Email:', authData.user.email);
    
    // Teste 2: Buscar assinatura
    console.log('\n2️⃣ Buscando assinatura...');
    const adminSupabase = createAdminClient();
    
    const { data: subscriptions, error: fetchError } = await adminSupabase
      .from('subscriptions_complete')
      .select('*')
      .eq('user_email', email)
      .order('created_at', { ascending: false });
    
    if (fetchError) {
      console.error('❌ Erro ao buscar assinatura:', fetchError);
      return;
    }
    
    if (!subscriptions || subscriptions.length === 0) {
      console.error('❌ Assinatura não encontrada');
      return;
    }
    
    const subscription = subscriptions[0];
    console.log('✅ Assinatura encontrada!');
    console.log('Status:', subscription.status);
    console.log('Plano:', subscription.plan_type);
    console.log('Expira em:', subscription.end_date);
    
    // Teste 3: Verificar expiração
    console.log('\n3️⃣ Verificando expiração...');
    const expiresAt = new Date(subscription.end_date);
    const now = new Date();
    
    console.log('Data de expiração:', expiresAt.toISOString());
    console.log('Data atual:', now.toISOString());
    console.log('Expirado?', expiresAt < now ? 'SIM ❌' : 'NÃO ✅');
    
    if (expiresAt < now) {
      console.error('❌ Assinatura expirada!');
      return;
    }
    
    console.log('\n✅ TODOS OS TESTES PASSARAM! Login deveria funcionar.');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testLogin();
