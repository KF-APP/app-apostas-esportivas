import { NextRequest, NextResponse } from 'next/server';
import { validatePayment, isPaid, calculateEndDate, identifyPlanType } from '@/lib/pagbank';
import { createSubscription, updateSubscription, getSubscriptionByPaymentId, getSubscriptionByEmail } from '@/lib/supabase';

/**
 * Webhook do PagBank - recebe notificações de pagamento
 */
export async function POST(request: NextRequest) {
  try {
    console.log('📥 Webhook PagBank recebido');
    
    const body = await request.json();
    console.log('📦 Dados do webhook:', JSON.stringify(body, null, 2));
    
    // Extrair ID do pagamento de diferentes formatos possíveis
    const paymentId = body.id || body.payment_id || body.reference_id || body.charges?.[0]?.id;
    
    if (!paymentId) {
      console.error('❌ Payment ID não fornecido no webhook');
      return NextResponse.json(
        { error: 'Payment ID não fornecido' },
        { status: 400 }
      );
    }

    console.log('🔍 Validando pagamento:', paymentId);
    
    // Validar pagamento na API do PagBank
    const payment = await validatePayment(paymentId);
    
    if (!payment) {
      console.error('❌ Pagamento não encontrado na API do PagBank');
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      );
    }

    console.log('💳 Status do pagamento:', payment.status);
    console.log('👤 Cliente:', payment.customer.email);
    console.log('💰 Valor:', payment.amount.value);

    // Verificar se já existe assinatura para este pagamento
    const existingSubscription = await getSubscriptionByPaymentId(paymentId);
    
    if (isPaid(payment.status)) {
      console.log('✅ Pagamento aprovado! Processando assinatura...');
      
      // Identificar tipo de plano baseado no valor
      const planType = identifyPlanType(payment.amount.value);
      const startDate = new Date();
      const endDate = calculateEndDate(planType, startDate);
      
      console.log('📋 Plano identificado:', planType);
      console.log('📅 Período:', startDate.toISOString(), 'até', endDate.toISOString());
      
      if (existingSubscription) {
        console.log('🔄 Atualizando assinatura existente...');
        
        const updated = await updateSubscription(existingSubscription.id, {
          status: 'active',
          plan_type: planType,
          amount: payment.amount.value,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          payment_method: payment.payment_method?.type || 'pagbank',
        });
        
        console.log('✅ Assinatura atualizada com sucesso!');
        
        return NextResponse.json({
          success: true,
          message: 'Assinatura atualizada com sucesso',
          subscription: updated,
        });
      } else {
        console.log('➕ Criando nova assinatura...');
        
        // Verificar se já existe assinatura para este email
        const existingByEmail = await getSubscriptionByEmail(payment.customer.email);
        
        if (existingByEmail) {
          console.log('🔄 Já existe assinatura para este email, atualizando...');
          
          const updated = await updateSubscription(existingByEmail.id, {
            status: 'active',
            plan_type: planType,
            amount: payment.amount.value,
            payment_id: paymentId,
            payment_method: payment.payment_method?.type || 'pagbank',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
          });
          
          console.log('✅ Assinatura atualizada com sucesso!');
          
          return NextResponse.json({
            success: true,
            message: 'Assinatura atualizada com sucesso',
            subscription: updated,
          });
        }
        
        const newSubscription = await createSubscription({
          user_email: payment.customer.email,
          user_name: payment.customer.name,
          plan_type: planType,
          status: 'active',
          payment_id: paymentId,
          payment_method: payment.payment_method?.type || 'pagbank',
          amount: payment.amount.value,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        });
        
        console.log('✅ Nova assinatura criada com sucesso!');
        
        return NextResponse.json({
          success: true,
          message: 'Assinatura criada com sucesso',
          subscription: newSubscription,
        });
      }
    } else {
      console.log('⏳ Pagamento ainda não aprovado:', payment.status);
      
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
    console.error('❌ Erro no webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Endpoint GET para verificar status de pagamento manualmente
 */
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
    console.log('🔍 Verificando pagamento:', paymentId);
    
    const payment = await validatePayment(paymentId);
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      );
    }

    const subscription = await getSubscriptionByPaymentId(paymentId);

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount.value,
        customer: payment.customer,
        created_at: payment.created_at,
        paid_at: payment.paid_at,
      },
      isPaid: isPaid(payment.status),
      subscription: subscription || null,
    });
  } catch (error) {
    console.error('❌ Erro ao verificar pagamento:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar pagamento', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
