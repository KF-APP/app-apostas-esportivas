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
  CreditCard,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const handleSelectPlan = (plan: 'monthly' | 'yearly') => {
    router.push(`/checkout?plan=${plan}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-3 py-2 sm:px-4 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <BarChart3 className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-400" />
              <h1 className="text-base sm:text-2xl font-bold text-white">PalpitePro</h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <a href="#planos">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2 h-7 sm:h-10">
                  Teste por 7 dias
                </Button>
              </a>
              <Link href="/login">
                <Button variant="outline" className="border-emerald-400/30 hover:bg-emerald-400/10 text-emerald-400 text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2 h-7 sm:h-10">
                  Entrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-3 py-6 sm:px-4 sm:py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-6">
          <h2 className="text-xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Se você não olha estatística, erra antes do jogo começar.
          </h2>
          
          <p className="text-sm sm:text-xl text-slate-300">
            Teste o PalpitePro por 7 dias e pare de apostar no achismo.
          </p>
          
          <div className="pt-2 sm:pt-4">
            <a href="#planos">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-lg px-4 py-3 sm:px-8 sm:py-6">
                Usar antes do próximo jogo
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Pain Points - Bloco de Dor */}
      <section className="bg-slate-900/50 py-6 sm:py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-8 text-center">
              Você perde dinheiro quando:
            </h3>
            
            <div className="space-y-2 sm:space-y-4 max-w-2xl mx-auto">
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-red-400 text-base sm:text-xl">•</span>
                <p className="text-sm sm:text-lg text-slate-200">aposta sem estatística</p>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-red-400 text-base sm:text-xl">•</span>
                <p className="text-sm sm:text-lg text-slate-200">decide no feeling</p>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-red-400 text-base sm:text-xl">•</span>
                <p className="text-sm sm:text-lg text-slate-200">ignora dados simples que mudam o jogo</p>
              </div>
              <p className="text-sm sm:text-lg text-slate-300 italic pt-2 sm:pt-4 text-center">
                A informação estava lá. Você só não olhou.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution - Bloco de Solução */}
      <section className="py-6 sm:py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm sm:text-xl md:text-2xl text-slate-200 leading-relaxed">
              O PalpitePro reúne estatísticas, histórico e confrontos em um só lugar.
            </p>
            <p className="text-sm sm:text-xl md:text-2xl text-slate-200 leading-relaxed mt-2 sm:mt-4">
              Você analisa o jogo com dados e evita decisões por impulso.
            </p>
          </div>
        </div>
      </section>

      {/* Credibility */}
      <section className="bg-slate-900/50 py-6 sm:py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-emerald-500/30 bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-8 md:p-12 text-center">
                <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-400 mx-auto mb-3 sm:mb-6" />
                <p className="text-sm sm:text-xl text-slate-200 leading-relaxed">
                  O PalpitePro não garante ganhos. Ele ajuda você a analisar melhor antes de decidir.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Teste 7 Dias - Antes do Checkout */}
      <section className="py-6 sm:py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-emerald-500/50 bg-gradient-to-br from-emerald-900/20 to-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-8 md:p-12">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
                  <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white text-center">
                    Teste por 7 dias. Decida depois.
                  </h3>
                </div>
                
                <div className="space-y-2 sm:space-y-4 text-sm sm:text-lg text-slate-200">
                  <p>Você testa o app por 7 dias.</p>
                  <p>Se não fizer sentido, cancele.</p>
                  <p>Se fizer, a cobrança continua automaticamente.</p>
                  <p className="font-medium text-emerald-400">Sem fidelidade.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="py-6 sm:py-16 bg-slate-900/30">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6 sm:mb-12">
              <h3 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">
                Escolha seu plano
              </h3>
              <p className="text-sm sm:text-lg text-emerald-400 font-medium">
                Teste por 7 dias e decida depois
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
              {/* Plano Mensal */}
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-2xl text-white mb-2 sm:mb-4">Plano Mensal</CardTitle>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                      <span className="text-2xl sm:text-4xl font-bold text-emerald-400">R$ 39,90</span>
                      <span className="text-xs sm:text-base text-slate-300">/mês</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-400 font-medium mt-2 sm:mt-3">
                    7 dias de teste • Cancele quando quiser
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs sm:text-base text-slate-200">Análises com IA</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs sm:text-base text-slate-200">Estatísticas completas</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs sm:text-base text-slate-200">Cancela quando quiser</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs sm:text-base text-slate-200">Sem fidelidade</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs sm:text-base text-slate-200">Acesso imediato</span>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-lg py-4 sm:py-6"
                    onClick={() => handleSelectPlan('monthly')}
                  >
                    Teste por 7 dias
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>

                  <p className="text-[10px] sm:text-xs text-slate-400 text-center pt-1 sm:pt-2">
                    Você pode cancelar quando quiser. Sem fidelidade. Sem promessa de lucro.
                  </p>
                </CardContent>
              </Card>

              {/* Plano Anual */}
              <Card className="border-emerald-500/50 bg-slate-800/50 backdrop-blur-sm relative">
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                  <Badge className="bg-emerald-500 text-white text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                    Melhor escolha
                  </Badge>
                </div>
                <CardHeader className="text-center pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-2xl text-white mb-2 sm:mb-4">Plano Anual</CardTitle>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                      <span className="text-2xl sm:text-4xl font-bold text-emerald-400">R$ 297</span>
                      <span className="text-xs sm:text-base text-slate-300">/ano</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-400 font-medium mt-2 sm:mt-3">
                    R$ 24,75/mês • 7 dias de teste • Economize R$ 181,80
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs sm:text-base text-slate-200">Análises com IA</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs sm:text-base text-slate-200">Estatísticas completas</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs sm:text-base text-slate-200">Cancela quando quiser</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs sm:text-base text-slate-200">Sem fidelidade</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs sm:text-base text-slate-200">Acesso imediato</span>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-lg py-4 sm:py-6"
                    onClick={() => handleSelectPlan('yearly')}
                  >
                    Teste por 7 dias
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>

                  <p className="text-[10px] sm:text-xs text-slate-400 text-center pt-1 sm:pt-2">
                    Você pode cancelar quando quiser. Sem fidelidade. Sem promessa de lucro.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-6 sm:py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-500 border-0 max-w-3xl mx-auto">
            <CardContent className="p-6 sm:p-12 text-center">
              <h3 className="text-lg sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-6">
                Pare de perder dinheiro por falta de análise
              </h3>
              <a href="#planos">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-slate-100 text-sm sm:text-lg px-4 py-3 sm:px-8 sm:py-6">
                  Usar antes do próximo jogo
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm py-4 sm:py-8">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              <span className="text-xs sm:text-sm text-slate-400">© 2024 PalpitePro. Todos os direitos reservados.</span>
            </div>
            <div className="flex gap-3 sm:gap-6 text-xs sm:text-sm text-slate-400">
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
