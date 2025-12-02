const PAGBANK_API_KEY = '998cf0b6-ea5d-4d95-bc8d-50322314dbb4e5c3d6a5442391c2c590e8ac15587b21dfb0-564f-4103-b3da-66fe3d4546f1';
const PAGBANK_API_URL = 'https://api.pagseguro.com';

export type PaymentStatus = 'PAID' | 'WAITING' | 'DECLINED' | 'CANCELED' | 'REFUNDED';

export interface PagBankPayment {
  id: string;
  reference_id: string;
  status: PaymentStatus;
  amount: {
    value: number;
    currency: string;
  };
  customer: {
    name: string;
    email: string;
  };
  payment_method?: {
    type: string;
  };
  created_at: string;
  paid_at?: string;
}

/**
 * Valida um pagamento no PagBank usando a API
 */
export async function validatePayment(paymentId: string): Promise<PagBankPayment | null> {
  try {
    console.log('🔍 Validando pagamento:', paymentId);
    
    const response = await fetch(`${PAGBANK_API_URL}/orders/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAGBANK_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ Erro ao validar pagamento:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('✅ Pagamento validado:', data.status);
    return data;
  } catch (error) {
    console.error('❌ Erro ao validar pagamento:', error);
    return null;
  }
}

/**
 * Verifica o status de um pagamento
 */
export async function checkPaymentStatus(paymentId: string): Promise<PaymentStatus | null> {
  const payment = await validatePayment(paymentId);
  return payment?.status || null;
}

/**
 * Verifica se um pagamento foi aprovado
 */
export function isPaid(status: PaymentStatus): boolean {
  return status === 'PAID';
}

/**
 * Calcula a data de expiração baseada no tipo de plano
 */
export function calculateEndDate(planType: 'monthly' | 'yearly', startDate: Date = new Date()): Date {
  const endDate = new Date(startDate);
  
  if (planType === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }
  
  return endDate;
}

/**
 * Identifica o tipo de plano baseado no valor pago
 */
export function identifyPlanType(amount: number): 'monthly' | 'yearly' {
  // Tolerância de R$ 1,00 para variações
  if (Math.abs(amount - PLAN_PRICES.yearly) < 1) {
    return 'yearly';
  }
  return 'monthly';
}

/**
 * Links de pagamento do PagBank
 */
export const PLAN_LINKS = {
  monthly: 'https://pag.ae/81eTUFyG6',
  yearly: 'https://pag.ae/81eTXTXM6',
};

/**
 * Preços dos planos
 */
export const PLAN_PRICES = {
  monthly: 29.90,
  yearly: 297.00,
};
