import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return subscription;
}

export async function updateSubscription(id: string, data: Partial<Subscription>) {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return subscription;
}

export async function getSubscriptionByEmail(email: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getSubscriptionByPaymentId(paymentId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('payment_id', paymentId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function checkSubscriptionStatus(email: string): Promise<boolean> {
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
}
