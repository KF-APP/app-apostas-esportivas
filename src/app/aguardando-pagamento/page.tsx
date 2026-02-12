'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Trophy,
  CheckCircle2,
  Mail,
  ArrowRight,
  Loader2,
  Clock,
  AlertCircle,
  ExternalLink,
  CreditCard,
  Smartphone
} from 'lucide-react';

// Links de pagamento do Mercado Pago
const PAYMENT_LINKS = {
  monthly: {
    creditCard: 'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=70081b96f45d4d23a339caa944dc6c26',
    pix: 'https://mpago.la/1s9ZWNM',
  },
  yearly: {
    creditCard: 'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=f02a5b40e82240d48e7b4dcc1dcb8ca1',
    pix: 'https://mpago.la/23QTLXE',
  },
};

function AguardandoPagamentoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const email = searchParams.get('email');
    const plan = searchParams.get('plan');
    
    const storedData = localStorage.getItem('palpitepro_checkout_data');
    
    if (storedData) {
      const data = JSON.parse(storedData);
      setCheckoutData(data);
    } else if (email && plan) {
      setCheckoutData({ email, plan });
    } else {
      router.push('/checkout');
      return;
    }
    
    setTimeout(() => {
      setChecking(false);
    }, 2000);
  }, [router, searchParams]);

  const handleGoToLogin = () => {
    router.push('/login');
  };

  const handlePayment = (method: 'creditCard' | 'pix') => {
    if (checkoutData?.plan) {
      const paymentLink = PAYMENT_LINKS[checkoutData.plan as keyof typeof PAYMENT_LINKS]?.[method];
      if (paymentLink) {
        window.open(paymentLink, '_blank');
      }
    }
  };

  if (!checkoutData) {
    return null;
  }

  const planNames = {
    monthly: 'Plano Mensal',
    yearly: 'Plano Anual',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">PalpitePro</h1>
              <p className="text-sm text-slate-400">Aguardando Confirmação</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {checking ? (
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="py-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Verificando Pagamento...</h3>
                <p className="text-slate-400">Aguarde enquanto confirmamos seu pagamento</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-10 h-10 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Aguardando Confirmação do Pagamento
                  </h2>
                  <p className="text-lg text-slate-400">
                    Seu pedido foi registrado com sucesso!
                  </p>
                </div>
              </div>

              <Alert className="bg-blue-500/10 border-blue-500/30">
                <AlertCircle className="w-4 h-4 text-blue-400" />
                <AlertDescription className="text-blue-300">
                  <strong>Importante:</strong> Assim que seu pagamento for confirmado, você receberá um email com as instruções de acesso e seu acesso será liberado automaticamente.
                </AlertDescription>
              </Alert>

              <Card className="bg-orange-500/10 border-orange-500/30">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <ExternalLink className="w-12 h-12 text-orange-400 mx-auto" />
                    <div>
                      <h4 className="font-semibold text-orange-400 mb-2">Ainda não pagou?</h4>
                      <p className="text-sm text-slate-300 mb-4">
                        Escolha a forma de pagamento e finalize sua assinatura
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={() => handlePayment('creditCard')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium flex-col h-auto py-3"
                        >
                          <CreditCard className="w-5 h-5 mb-1" />
                          <span className="text-sm">Cartão</span>
                          <span className="text-xs opacity-75">7 dias grátis</span>
                        </Button>
                        <Button
                          onClick={() => handlePayment('pix')}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-medium flex-col h-auto py-3"
                        >
                          <Smartphone className="w-5 h-5 mb-1" />
                          <span className="text-sm">PIX</span>
                          <span className="text-xs opacity-75">Instantâneo</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Detalhes do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span className="text-white font-semibold">{checkoutData.email}</span>
                    </div>
                    {checkoutData.name && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Nome:</span>
                        <span className="text-white font-semibold">{checkoutData.name}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Plano:</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        {planNames[checkoutData.plan as keyof typeof planNames] || checkoutData.plan}
                      </Badge>
                    </div>
                  </div>

                  <Separator className="bg-slate-800" />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-300">Pedido registrado com sucesso</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span className="text-slate-300">Aguardando confirmação do pagamento</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-slate-300">Email será enviado após confirmação</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-emerald-500/10 border-emerald-500/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-emerald-400 mb-1">Acesso Automático</h4>
                      <p className="text-sm text-slate-300">
                        Quando o pagamento for confirmado, seu acesso será liberado automaticamente e você receberá um email com as instruções.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">O Que Acontece Agora?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Confirmação do Pagamento</h4>
                      <p className="text-sm text-slate-400">
                        O processamento do pagamento geralmente leva alguns minutos
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Liberação Automática</h4>
                      <p className="text-sm text-slate-400">
                        Seu acesso será liberado automaticamente no sistema
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Email de Boas-Vindas</h4>
                      <p className="text-sm text-slate-400">
                        Você receberá um email com instruções para acessar a plataforma
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  onClick={handleGoToLogin}
                >
                  Tentar Acessar Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-xs text-slate-500 mt-2">
                  Você será direcionado para a tela de login. O acesso só será liberado após confirmação do pagamento.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AguardandoPagamentoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    }>
      <AguardandoPagamentoContent />
    </Suspense>
  );
}
