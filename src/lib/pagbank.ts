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
  created_at: string;
  paid_at?: string;
}

export async function validatePayment(paymentId: string): Promise<PagBankPayment | null> {
  try {
    const response = await fetch(`${PAGBANK_API_URL}/orders/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAGBANK_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Erro ao validar pagamento:', response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao validar pagamento:', error);
    return null;
  }
}

export async function checkPaymentStatus(paymentId: string): Promise<PaymentStatus | null> {
  const payment = await validatePayment(paymentId);
  return payment?.status || null;
}

export function isPaid(status: PaymentStatus): boolean {
  return status === 'PAID';
}

export function calculateEndDate(planType: 'monthly' | 'yearly', startDate: Date = new Date()): Date {
  const endDate = new Date(startDate);
  
  if (planType === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }
  
  return endDate;
}

export const PLAN_LINKS = {
  monthly: 'https://pag.ae/81eTUFyG6',
  yearly: 'https://pag.ae/81eTXTXM6',
};

export const PLAN_PRICES = {
  monthly: 29.90,
  yearly: 297.00,
};
