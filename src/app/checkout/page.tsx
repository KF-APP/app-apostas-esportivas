'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Trophy,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Loader2,
  Star,
  AlertCircle,
  CreditCard,
  Smartphone
} from 'lucide-react';
import Link from 'next/link';
import { PLAN_PRICES } from '@/lib/payment';

type PlanType = 'monthly' | 'yearly';

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

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'creditCard' | 'pix'>('creditCard');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showExpiredAlert, setShowExpiredAlert] = useState(false);

  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam === 'monthly' || planParam === 'yearly') {
      setSelectedPlan(planParam);
    }
    
    const expired = searchParams.get('expired');
    if (expired === 'true') {
      setShowExpiredAlert(true);
    }
  }, [searchParams]);

  const plans = {
    monthly: {
      name: 'Plano Mensal',
      price: PLAN_PRICES.monthly,
      priceFormatted: `R$ 39,90`,
      period: '/mês',
      description: 'Renovação automática mensal',
    },
    yearly: {
      name: 'Plano Anual',
      price: PLAN_PRICES.yearly,
      priceFormatted: `R$ ${PLAN_PRICES.yearly.toFixed(2).replace('.', ',')}`,
      period: '/ano',
      description: 'Pagamento único anual',
      savings: 'Economize R$ 181,80 (38%)',
    },
  };

  const currentPlan = plans[selectedPlan];

  const handleStartFreeTrial = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    if (formData.password.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Salvar dados do usuário no localStorage temporariamente
      localStorage.setItem('palpitepro_checkout_data', JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        plan: selectedPlan,
        timestamp: new Date().toISOString(),
      }));

      // Criar usuário pendente no Supabase
      const response = await fetch('/api/subscription/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
          plan: selectedPlan,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Erro na API:', result);
        throw new Error(result.details || 'Erro ao criar usuário');
      }

      // Log de sucesso
      console.log('✅ Usuário criado/atualizado:', result);

      // Obter link de pagamento correto baseado no plano e método de pagamento
      const paymentLink = PAYMENT_LINKS[selectedPlan][selectedPaymentMethod];

      if (!paymentLink) {
        console.error('❌ Link de pagamento não encontrado');
        alert('Erro: Link de pagamento não configurado. Entre em contato com o suporte.');
        setLoading(false);
        return;
      }

      console.log('🔗 Redirecionando para pagamento:', paymentLink);

      // SOLUÇÃO MOBILE: Criar elemento <a> temporário e simular clique
      const link = document.createElement('a');
      link.href = paymentLink;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Pequeno delay para garantir que o link abriu antes de redirecionar
      setTimeout(() => {
        router.push(`/aguardando-pagamento?plan=${selectedPlan}&email=${encodeURIComponent(formData.email)}`);
      }, 300);

    } catch (error) {
      console.error('❌ Erro no checkout:', error);
      alert('Erro ao processar checkout. Tente novamente.');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = formData.name && formData.email && formData.password && formData.password.length >= 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">PalpitePro</h1>
                <p className="text-sm text-slate-400">Checkout Seguro</p>
              </div>
            </div>
            
            <Link href="/">
              <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {showExpiredAlert && (
            <Alert className="mb-6 bg-yellow-500/10 border-yellow-500/30">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <AlertDescription className="text-yellow-400">
                Sua assinatura expirou. Renove agora para continuar acessando os palpites!
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Escolha Seu Plano</CardTitle>
                  <CardDescription className="text-slate-400">
                    Selecione a melhor opção para você
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as PlanType)}>
                    <div className="space-y-3">
                      <label
                        htmlFor="monthly"
                        className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedPlan === 'monthly'
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <div>
                            <p className="font-semibold text-white">Plano Mensal</p>
                            <p className="text-sm text-slate-400">R$ 39,90/mês</p>
                          </div>
                        </div>
                      </label>

                      <label
                        htmlFor="yearly"
                        className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all relative ${
                          selectedPlan === 'yearly'
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <Badge className="absolute -top-2 -right-2 bg-emerald-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Economize 38%
                        </Badge>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="yearly" id="yearly" />
                          <div>
                            <p className="font-semibold text-white">Plano Anual</p>
                            <p className="text-sm text-slate-400">R$ 297,00/ano</p>
                            <p className="text-xs text-emerald-400 mt-1">Apenas R$ 24,75/mês</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-emerald-500" />
                    Criar Sua Conta
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Preencha seus dados para criar sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-300">Nome Completo</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="João Silva"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="joao@exemplo.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                      <p className="text-xs text-slate-400">
                        Este será seu email de acesso à plataforma
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-300">Senha</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                      <p className="text-xs text-slate-400">
                        Crie uma senha segura com no mínimo 6 caracteres
                      </p>
                    </div>

                    <Separator className="bg-slate-800" />

                    <div className="space-y-3">
                      <Label className="text-slate-300">Método de Pagamento</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('creditCard')}
                          className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                            selectedPaymentMethod === 'creditCard'
                              ? 'border-emerald-500 bg-emerald-500/10'
                              : 'border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <CreditCard className={`w-6 h-6 ${selectedPaymentMethod === 'creditCard' ? 'text-emerald-400' : 'text-slate-400'}`} />
                          <span className={`text-sm font-medium ${selectedPaymentMethod === 'creditCard' ? 'text-emerald-400' : 'text-slate-300'}`}>
                            Cartão de Crédito
                          </span>
                          <span className="text-xs text-slate-500">7 dias grátis</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('pix')}
                          className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                            selectedPaymentMethod === 'pix'
                              ? 'border-emerald-500 bg-emerald-500/10'
                              : 'border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <Smartphone className={`w-6 h-6 ${selectedPaymentMethod === 'pix' ? 'text-emerald-400' : 'text-slate-400'}`} />
                          <span className={`text-sm font-medium ${selectedPaymentMethod === 'pix' ? 'text-emerald-400' : 'text-slate-300'}`}>
                            PIX
                          </span>
                          <span className="text-xs text-slate-500">Aprovação instantânea</span>
                        </button>
                      </div>
                    </div>

                    <Separator className="bg-slate-800" />

                    <Alert className="bg-blue-500/10 border-blue-500/30">
                      <Lock className="w-4 h-4 text-blue-400" />
                      <AlertDescription className="text-blue-300 text-sm">
                        Sua conta será criada e ativada automaticamente após a confirmação do pagamento
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      <Button
                        onClick={handleStartFreeTrial}
                        size="lg"
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-lg font-semibold"
                        disabled={loading || !isFormValid}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            {selectedPaymentMethod === 'creditCard' ? 'Teste por 7 dias' : 'Pagar com PIX'}
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-center text-slate-400">
                        {currentPlan.priceFormatted} {currentPlan.period} após o período de teste
                      </p>
                      
                      <p className="text-xs text-center text-slate-500">
                        Você pode cancelar quando quiser. Sem fidelidade. Sem promessa de lucro.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                      <Lock className="w-4 h-4" />
                      <span>Pagamento 100% seguro</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{currentPlan.name}</h3>
                        <p className="text-sm text-slate-400">{currentPlan.description}</p>
                        {currentPlan.savings && (
                          <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            {currentPlan.savings}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Separator className="bg-slate-800" />

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-300">Análise de dados em tempo real</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-300">Palpites gerados por IA</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-300">Histórico de confrontos diretos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-300">Estatísticas detalhadas</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-300">Painel de controle completo</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-300">Suporte prioritário</span>
                      </div>
                    </div>

                    <Separator className="bg-slate-800" />

                    <div className="space-y-2">
                      <div className="flex justify-between text-slate-400">
                        <span>Subtotal</span>
                        <span>{currentPlan.priceFormatted}</span>
                      </div>
                      {selectedPlan === 'yearly' && (
                        <div className="flex justify-between text-emerald-400 text-sm">
                          <span>Desconto anual</span>
                          <span>-R$ 181,80</span>
                        </div>
                      )}
                      <Separator className="bg-slate-800" />
                      <div className="flex justify-between text-xl font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-emerald-400">{currentPlan.priceFormatted}</span>
                      </div>
                      <p className="text-xs text-slate-400 text-right">{currentPlan.period}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-emerald-500/10 border-emerald-500/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-emerald-400 mb-1">Acesso Imediato</h4>
                      <p className="text-sm text-slate-300">
                        Após a confirmação do pagamento, sua conta será ativada automaticamente e você poderá fazer login com o email e senha cadastrados.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-slate-400">Carregando checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
