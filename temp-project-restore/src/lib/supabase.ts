import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Cliente Supabase com ANON KEY (para uso público)
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// Cliente Supabase com SERVICE ROLE KEY (para operações administrativas)
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase não configurado. Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Exportar createClient para uso direto em componentes (cliente público)
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase não configurado. Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

export type Subscription = {
  id: string;
  user_email: string;
  user_name: string;
  plan_type: 'monthly' | 'yearly';
  status: 'active' | 'expired' | 'pending' | 'cancelled';
  payment_id: string;
  payment_method: string;
  amount: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
};

export async function createSubscription(data: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    throw new Error('Supabase não configurado. Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  const { data: subscription, error } = await supabase
    .from('subscriptions_complete')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return subscription;
}

export async function updateSubscription(id: string, data: Partial<Subscription>) {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    throw new Error('Supabase não configurado. Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  const { data: subscription, error } = await supabase
    .from('subscriptions_complete')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return subscription;
}

export async function getSubscriptionByEmail(email: string) {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    throw new Error('Supabase não configurado. Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  const { data, error } = await supabase
    .from('subscriptions_complete')
    .select('*')
    .eq('user_email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getSubscriptionByPaymentId(paymentId: string) {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    throw new Error('Supabase não configurado. Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  const { data, error } = await supabase
    .from('subscriptions_complete')
    .select('*')
    .eq('payment_id', paymentId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function checkSubscriptionStatus(email: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      console.warn('Supabase não configurado');
      return false;
    }

    const subscription = await getSubscriptionByEmail(email);
    
    if (!subscription) return false;
    
    if (subscription.status !== 'active') return false;
    
    const endDate = new Date(subscription.end_date);
    const now = new Date();
    
    if (now > endDate) {
      await updateSubscription(subscription.id, { status: 'expired' });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar status da assinatura:', error);
    return false;
  }
}
