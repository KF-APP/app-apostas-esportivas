import { NextRequest, NextResponse } from 'next/server';
import { validatePayment, isPaid, calculateEndDate, PLAN_PRICES } from '@/lib/pagbank';
import { createSubscription, updateSubscription, getSubscriptionByPaymentId } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const paymentId = body.id || body.payment_id || body.reference_id;
    
    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID não fornecido' },
        { status: 400 }
      );
    }

    const payment = await validatePayment(paymentId);
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      );
    }

    const existingSubscription = await getSubscriptionByPaymentId(paymentId);
    
    if (isPaid(payment.status)) {
      const planType = payment.amount.value === PLAN_PRICES.yearly ? 'yearly' : 'monthly';
      const startDate = new Date();
      const endDate = calculateEndDate(planType, startDate);
      
      if (existingSubscription) {
        await updateSubscription(existingSubscription.id, {
          status: 'active',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        });
        
        return NextResponse.json({
          success: true,
          message: 'Assinatura atualizada com sucesso',
          subscription: existingSubscription,
        });
      } else {
        const newSubscription = await createSubscription({
          user_email: payment.customer.email,
          user_name: payment.customer.name,
          plan_type: planType,
          status: 'active',
          payment_id: paymentId,
          payment_method: 'pagbank',
          amount: payment.amount.value,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        });
        
        return NextResponse.json({
          success: true,
          message: 'Assinatura criada com sucesso',
          subscription: newSubscription,
        });
      }
    } else {
      if (existingSubscription) {
        await updateSubscription(existingSubscription.id, {
          status: 'pending',
        });
      }
      
      return NextResponse.json({
        success: false,
        message: 'Pagamento ainda não confirmado',
        status: payment.status,
      });
    }
  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paymentId = searchParams.get('payment_id');
  
  if (!paymentId) {
    return NextResponse.json(
      { error: 'Payment ID não fornecido' },
      { status: 400 }
    );
  }

  try {
    const payment = await validatePayment(paymentId);
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      payment,
      isPaid: isPaid(payment.status),
    });
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar pagamento' },
      { status: 500 }
    );
  }
}
