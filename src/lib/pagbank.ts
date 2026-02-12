// PagBank API Integration

const PAGBANK_API_URL = 'https://sandbox.api.pagseguro.com'; // Use production URL quando necessário
const PAGBANK_TOKEN = process.env.PAGBANK_TOKEN || '';

export interface PagBankPayment {
  id: string;
  reference_id?: string;
  status: string;
  created_at: string;
  paid_at?: string;
  amount: {
    value: number;
    currency: string;
  };
  customer: {
    name: string;
    email: string;
    tax_id?: string;
  };
  payment_method?: {
    type: string;
    card?: {
      brand: string;
      last_digits: string;
    };
  };
  charges?: Array<{
    id: string;
    status: string;
  }>;
}

/**
 * Valida um pagamento no PagBank pela API
 */
export async function validatePayment(paymentId: string): Promise<PagBankPayment | null> {
  try {
    if (!PAGBANK_TOKEN) {
      console.error('❌ PAGBANK_TOKEN não configurado');
      return null;
    }

    const response = await fetch(`${PAGBANK_API_URL}/orders/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${PAGBANK_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ Erro ao validar pagamento:', response.status, response.statusText);
      return null;
    }

    const payment = await response.json();
    return payment as PagBankPayment;
  } catch (error) {
    console.error('❌ Erro ao validar pagamento:', error);
    return null;
  }
}

/**
 * Verifica se o status do pagamento indica que foi pago
 */
export function isPaid(status: string): boolean {
  const paidStatuses = ['PAID', 'AUTHORIZED', 'AVAILABLE', 'IN_ANALYSIS'];
  return paidStatuses.includes(status.toUpperCase());
}

/**
 * Identifica o tipo de plano baseado no valor do pagamento
 */
export function identifyPlanType(amountInCents: number): 'monthly' | 'yearly' {
  // Valores em centavos
  const MONTHLY_PRICE = 2990; // R$ 29,90
  const ANNUAL_PRICE = 29990; // R$ 299,90

  // Tolerância de 1% para variações de preço
  const tolerance = 0.01;

  if (Math.abs(amountInCents - MONTHLY_PRICE) / MONTHLY_PRICE <= tolerance) {
    return 'monthly';
  }

  if (Math.abs(amountInCents - ANNUAL_PRICE) / ANNUAL_PRICE <= tolerance) {
    return 'yearly';
  }

  // Se não bater exatamente, usa o valor mais próximo
  const distanceToMonthly = Math.abs(amountInCents - MONTHLY_PRICE);
  const distanceToAnnual = Math.abs(amountInCents - ANNUAL_PRICE);

  return distanceToMonthly < distanceToAnnual ? 'monthly' : 'yearly';
}

/**
 * Calcula a data de término da assinatura
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
 * Formata valor em centavos para reais
 */
export function formatCurrency(amountInCents: number): string {
  const amountInReais = amountInCents / 100;
  return amountInReais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Cria um checkout no PagBank
 */
export async function createCheckout(data: {
  referenceId: string;
  customerName: string;
  customerEmail: string;
  customerTaxId: string;
  amount: number;
  description: string;
}): Promise<{ checkoutUrl: string; orderId: string } | null> {
  try {
    if (!PAGBANK_TOKEN) {
      console.error('❌ PAGBANK_TOKEN não configurado');
      return null;
    }

    const response = await fetch(`${PAGBANK_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAGBANK_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reference_id: data.referenceId,
        customer: {
          name: data.customerName,
          email: data.customerEmail,
          tax_id: data.customerTaxId,
        },
        items: [
          {
            name: data.description,
            quantity: 1,
            unit_amount: data.amount,
          },
        ],
        notification_urls: [
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/pagbank`,
        ],
      }),
    });

    if (!response.ok) {
      console.error('❌ Erro ao criar checkout:', response.status, response.statusText);
      return null;
    }

    const result = await response.json();
    return {
      checkoutUrl: result.links.find((l: any) => l.rel === 'PAY')?.href || '',
      orderId: result.id,
    };
  } catch (error) {
    console.error('❌ Erro ao criar checkout:', error);
    return null;
  }
}
