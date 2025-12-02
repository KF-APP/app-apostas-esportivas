'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  TrendingUp, 
  Shield, 
  Zap, 
  CheckCircle2, 
  Star,
  BarChart3,
  Target,
  Sparkles,
  ArrowRight,
  Brain,
  Cpu
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">PalpitePro</h1>
                <p className="text-sm text-slate-400">Análises com Inteligência Artificial</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
                  Entrar
                </Button>
              </Link>
              <Link href="/checkout">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                  Começar Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-1">
            <Brain className="w-4 h-4 mr-2" />
            Inteligência Artificial Analisando Suas Apostas
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Palpites Analisados por
            <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent"> Inteligência Artificial</span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Nossa IA analisa milhares de dados em segundos: histórico de confrontos, estatísticas dos times, desempenho recente e muito mais para gerar os melhores palpites.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/checkout">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-lg px-8 py-6">
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div>
              <p className="text-3xl font-bold text-emerald-400">85%</p>
              <p className="text-sm text-slate-400 mt-1">Taxa de Acerto</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-400">10k+</p>
              <p className="text-sm text-slate-400 mt-1">Análises Realizadas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-400">500+</p>
              <p className="text-sm text-slate-400 mt-1">Usuários Ativos</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Feature Highlight */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-gradient-to-br from-purple-500/10 to-emerald-500/10 border-purple-500/30 overflow-hidden">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                    <Cpu className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white">
                    Inteligência Artificial Trabalhando Para Você
                  </h3>
                  <p className="text-lg text-slate-300">
                    Nossa IA processa milhares de dados em tempo real para identificar os melhores palpites. Ela analisa:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                      <span className="text-slate-300">Histórico completo de confrontos diretos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                      <span className="text-slate-300">Desempenho recente dos times (últimos 10 jogos)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                      <span className="text-slate-300">Estatísticas de gols marcados e sofridos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                      <span className="text-slate-300">Padrões e tendências identificados automaticamente</span>
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-emerald-500 blur-3xl opacity-20"></div>
                  <div className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-slate-300 text-sm">IA Analisando...</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 w-4/5 animate-pulse"></div>
                      </div>
                      <p className="text-xs text-slate-400">Processando 10.000+ pontos de dados</p>
                    </div>
                    <div className="pt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Confiança do palpite:</span>
                        <span className="text-emerald-400 font-bold">87%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Nível de risco:</span>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          Conservador
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Por Que Escolher PalpitePro?
            </h3>
            <p className="text-lg text-slate-400">
              Ferramentas profissionais para apostadores inteligentes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-600/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-emerald-400" />
                </div>
                <CardTitle className="text-white">Análise de Dados Reais</CardTitle>
                <CardDescription className="text-slate-400">
                  Palpites baseados em estatísticas reais, histórico de confrontos e desempenho dos times
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-600/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Níveis de Risco</CardTitle>
                <CardDescription className="text-slate-400">
                  Escolha entre palpites conservadores, médios ou de alto risco de acordo com seu perfil
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-600/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Atualizações em Tempo Real</CardTitle>
                <CardDescription className="text-slate-400">
                  Acompanhe jogos ao vivo e receba palpites atualizados constantemente
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Como Funciona
            </h3>
            <p className="text-lg text-slate-400">
              Simples, rápido e eficiente
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Crie Sua Conta</h4>
                <p className="text-slate-400">
                  Cadastre-se em menos de 1 minuto e tenha acesso imediato à plataforma
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Escolha os Jogos</h4>
                <p className="text-slate-400">
                  Navegue pelos jogos do dia e selecione aqueles que deseja analisar
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Receba Palpites da IA</h4>
                <p className="text-slate-400">
                  Veja análises detalhadas e palpites gerados por inteligência artificial com diferentes níveis de risco
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Escolha Seu Plano
            </h3>
            <p className="text-lg text-slate-400">
              Planos flexíveis para todos os perfis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Mensal */}
            <Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-600/50 transition-all">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl text-white mb-2">Plano Mensal</CardTitle>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-white">R$ 29,90</span>
                  <span className="text-slate-400">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">Análise de dados em tempo real</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">Palpites com IA para todos os níveis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">Histórico de confrontos diretos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">Estatísticas detalhadas dos times</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">Cancele quando quiser</span>
                  </div>
                </div>

                <Link href="/checkout?plan=monthly" className="block">
                  <Button size="lg" variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-lg py-6">
                    Começar Agora
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <p className="text-center text-sm text-slate-400">
                  Renovação automática mensal
                </p>
              </CardContent>
            </Card>

            {/* Plano Anual */}
            <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-emerald-500 text-white">
                  <Star className="w-4 h-4 mr-1" />
                  Economize 17%
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl text-white mb-2">Plano Anual</CardTitle>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-white">R$ 297</span>
                  <span className="text-slate-400">/ano</span>
                </div>
                <p className="text-sm text-emerald-400 mt-2">
                  Apenas R$ 24,75/mês
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">Análise de dados em tempo real</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">Palpites com IA para todos os níveis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">Histórico de confrontos diretos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">Estatísticas detalhadas dos times</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300 font-semibold">Economize R$ 61,80 por ano</span>
                  </div>
                </div>

                <Link href="/checkout?plan=yearly" className="block">
                  <Button size="lg" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-lg py-6">
                    Garantir Desconto Anual
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <p className="text-center text-sm text-slate-400">
                  Pagamento único anual • Melhor custo-benefício
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 border-0 max-w-4xl mx-auto">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto Para Apostar de Forma Inteligente?
            </h3>
            <p className="text-lg text-emerald-50 mb-8 max-w-2xl mx-auto">
              Junte-se a centenas de apostadores que já estão tomando decisões mais inteligentes com análises de IA
            </p>
            <Link href="/checkout">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-slate-100 text-lg px-8 py-6">
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                <Trophy className="w-5 h-5 text-white" />
              </div>
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
