'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Trophy, 
  CheckCircle2, 
  CreditCard,
  Lock,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular processamento de pagamento
    setTimeout(() => {
      // Gerar credenciais de acesso
      const username = formData.email.split('@')[0];
      const password = Math.random().toString(36).slice(-8);

      // Salvar no localStorage (em produção, isso viria do backend)
      localStorage.setItem('betsmartpro_credentials', JSON.stringify({
        username,
        password,
        email: formData.email,
        purchaseDate: new Date().toISOString()
      }));

      // Redirecionar para página de sucesso
      router.push('/success');
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">BetSmart Pro</h1>
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
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Formulário de Pagamento */}
          <div>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-500" />
                  Informações de Pagamento
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Preencha seus dados para concluir a compra
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                      Suas credenciais de acesso serão enviadas para este email
                    </p>
                  </div>

                  <Separator className="bg-slate-800" />

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-slate-300">Número do Cartão</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry" className="text-slate-300">Validade</Label>
                      <Input
                        id="cardExpiry"
                        name="cardExpiry"
                        placeholder="MM/AA"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        required
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvc" className="text-slate-300">CVC</Label>
                      <Input
                        id="cardCvc"
                        name="cardCvc"
                        placeholder="123"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        required
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Finalizar Compra - R$ 97,00
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                    <Lock className="w-4 h-4" />
                    <span>Pagamento 100% seguro e criptografado</span>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
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
                      <h3 className="font-semibold text-white mb-1">BetSmart Pro - Acesso Vitalício</h3>
                      <p className="text-sm text-slate-400">Pagamento único • Sem mensalidades</p>
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
                      <span className="text-slate-300">Sugestões para todos os níveis de risco</span>
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
                      <span className="text-slate-300">Atualizações gratuitas</span>
                    </div>
                  </div>

                  <Separator className="bg-slate-800" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span>
                      <span>R$ 97,00</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Desconto</span>
                      <span className="text-emerald-400">R$ 0,00</span>
                    </div>
                    <Separator className="bg-slate-800" />
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-emerald-400">R$ 97,00</span>
                    </div>
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
                      Após a confirmação do pagamento, você receberá suas credenciais de acesso por email e poderá começar a usar imediatamente.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
