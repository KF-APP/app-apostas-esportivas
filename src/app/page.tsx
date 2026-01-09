'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  TrendingDown,
  BarChart3,
  Shield,
  Smartphone,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [monthlyPaymentMethod, setMonthlyPaymentMethod] = useState<'pix' | 'card'>('card');
  const [yearlyPaymentMethod, setYearlyPaymentMethod] = useState<'pix' | 'card'>('card');

  const paymentLinks = {
    monthly: {
      pix: 'https://pag.ae/81okwt4xM',
      card: 'https://pag.ae/81okxh7cM'
    },
    yearly: {
      pix: 'https://pag.ae/81oky7p4o',
      card: 'https://pag.ae/81okzzFnJ'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-emerald-400" />
              <h1 className="text-2xl font-bold text-white">PalpitePro</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <a href="#planos">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Analisar jogos com dados
                </Button>
              </a>
              <Link href="/login">
                <Button variant="outline" className="border-emerald-400/30 hover:bg-emerald-400/10 text-emerald-400">
                  Entrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Se você não olha estatística, erra antes do jogo começar.
          </h2>
          
          <p className="text-xl text-slate-300">
            O PalpitePro mostra estatísticas e análises com IA pra você parar de apostar no impulso
          </p>
          
          <div className="pt-4">
            <a href="#planos">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-8 py-6">
                Analisar jogos com dados
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="bg-slate-900/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
              Você está perdendo dinheiro por:
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-red-500/30 bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-white mb-2">Apostar sem estatística</h4>
                      <p className="text-slate-300">Jogar no escuro</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-500/30 bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <TrendingDown className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-white mb-2">Decidir no feeling</h4>
                      <p className="text-slate-300">Achismo não paga conta</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-500/30 bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-white mb-2">Errar por detalhe simples</h4>
                      <p className="text-slate-300">Um dado muda tudo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-500/30 bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <TrendingDown className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-white mb-2">Perder dinheiro por besteira</h4>
                      <p className="text-slate-300">A informação estava lá</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
              Com um app de estatística e dicas, você bate o olho e já tem as informações na mão
            </h3>
            
            <div className="space-y-6 mt-12">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-1">Organiza dados</h4>
                  <p className="text-slate-300">Histórico, estatísticas e confrontos diretos em um lugar só</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-1">Ajuda na leitura do jogo</h4>
                  <p className="text-slate-300">IA analisa padrões que você não veria sozinho</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-1">Evita erro por impulso</h4>
                  <p className="text-slate-300">Você decide com base em fatos, não em achismo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility */}
      <section className="bg-slate-900/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-emerald-500/30 bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12 text-center">
                <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
                <p className="text-xl text-slate-200 leading-relaxed">
                  O PalpitePro não promete lucro. Ele ajuda você a analisar melhor antes de decidir.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-lg text-slate-300 mb-6">
                Se você já errou uma aposta por falta de estatística, esse app já teria se pago.
              </p>
              <h3 className="text-3xl md:text-4xl font-bold text-white">
                Escolha seu plano
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Plano Mensal */}
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl text-white mb-4">Plano Mensal</CardTitle>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-400 line-through">De R$ 79,90/mês</p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold text-emerald-400">R$ 39,90</span>
                      <span className="text-slate-300">/mês</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mt-3">
                    Menos do que errar uma aposta por falta de estatística
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-200">Análises com IA</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-200">Estatísticas completas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-200">Cancela quando quiser</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-200">Sem fidelidade</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-200">Acesso imediato</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <p className="text-sm text-slate-300 text-center font-medium">Escolha a forma de pagamento:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant={monthlyPaymentMethod === 'pix' ? 'default' : 'outline'}
                        className={monthlyPaymentMethod === 'pix' 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                          : 'border-slate-600 hover:bg-slate-700/50 text-slate-100 hover:text-white font-medium'
                        }
                        onClick={() => setMonthlyPaymentMethod('pix')}
                      >
                        <Smartphone className="w-4 h-4 mr-2" />
                        PIX
                      </Button>
                      <Button
                        variant={monthlyPaymentMethod === 'card' ? 'default' : 'outline'}
                        className={monthlyPaymentMethod === 'card' 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                          : 'border-slate-600 hover:bg-slate-700/50 text-slate-100 hover:text-white font-medium'
                        }
                        onClick={() => setMonthlyPaymentMethod('card')}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Cartão
                      </Button>
                    </div>
                  </div>

                  <a 
                    href={paymentLinks.monthly[monthlyPaymentMethod]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button size="lg" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-lg py-6">
                      Analisar jogos com dados
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Plano Anual */}
              <Card className="border-emerald-500/50 bg-slate-800/50 backdrop-blur-sm relative">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-emerald-500 text-white">
                    Melhor escolha
                  </Badge>
                </div>
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl text-white mb-4">Plano Anual</CardTitle>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-400 line-through">De R$ 958,80/ano</p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold text-emerald-400">R$ 297</span>
                      <span className="text-slate-300">/ano</span>
                    </div>
                  </div>
                  <p className="text-sm text-emerald-400 font-medium mt-3">
                    R$ 24,75/mês • Economize R$ 181,80
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-200">Análises com IA</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-200">Estatísticas completas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-200">Cancela quando quiser</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-200">Sem fidelidade</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-200">Acesso imediato</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <p className="text-sm text-slate-300 text-center font-medium">Escolha a forma de pagamento:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant={yearlyPaymentMethod === 'pix' ? 'default' : 'outline'}
                        className={yearlyPaymentMethod === 'pix' 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                          : 'border-slate-600 hover:bg-slate-700/50 text-slate-100 hover:text-white font-medium'
                        }
                        onClick={() => setYearlyPaymentMethod('pix')}
                      >
                        <Smartphone className="w-4 h-4 mr-2" />
                        PIX
                      </Button>
                      <Button
                        variant={yearlyPaymentMethod === 'card' ? 'default' : 'outline'}
                        className={yearlyPaymentMethod === 'card' 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                          : 'border-slate-600 hover:bg-slate-700/50 text-slate-100 hover:text-white font-medium'
                        }
                        onClick={() => setYearlyPaymentMethod('card')}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Cartão
                      </Button>
                    </div>
                  </div>

                  <a 
                    href={paymentLinks.yearly[yearlyPaymentMethod]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button size="lg" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-lg py-6">
                      Analisar jogos com dados
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency */}
      <section className="bg-slate-900/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              As análises são atualizadas diariamente
            </h3>
            <p className="text-lg text-slate-300">
              Cada jogo sem estatística é uma oportunidade perdida
            </p>
            <p className="text-lg text-slate-300 font-medium">
              Quem analisa antes, erra menos
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-500 border-0 max-w-3xl mx-auto">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Pare de perder dinheiro por falta de análise
              </h3>
              <a href="#planos">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-slate-100 text-lg px-8 py-6">
                  Analisar jogos com dados
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-400">© 2024 PalpitePro. Todos os direitos reservados.</span>
            </div>
            <div className="flex gap-6 text-slate-400">
              <a href="#" className="hover:text-emerald-400 transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacidade</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Suporte</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
