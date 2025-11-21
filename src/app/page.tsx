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
  ArrowRight
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
                <h1 className="text-2xl font-bold text-white">BetSmart Pro</h1>
                <p className="text-sm text-slate-400">Sugestões Inteligentes de Apostas</p>
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
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1">
            <Sparkles className="w-4 h-4 mr-2" />
            Análise Inteligente de Apostas Esportivas
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Transforme Suas Apostas em
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"> Decisões Inteligentes</span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Acesse sugestões de apostas baseadas em análise de dados reais, histórico de confrontos e estatísticas detalhadas dos times.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/checkout">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-lg px-8 py-6">
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800 text-lg px-8 py-6">
              Ver Demonstração
            </Button>
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

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Por Que Escolher o BetSmart Pro?
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
                  Sugestões baseadas em estatísticas reais, histórico de confrontos e desempenho dos times
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
                  Escolha entre apostas conservadoras, médias ou de alto risco de acordo com seu perfil
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
                  Acompanhe jogos ao vivo e receba sugestões atualizadas constantemente
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
                <h4 className="text-xl font-bold text-white mb-2">Receba Sugestões</h4>
                <p className="text-slate-400">
                  Veja análises detalhadas e sugestões de apostas com diferentes níveis de risco
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Plano Simples e Transparente
            </h3>
            <p className="text-lg text-slate-400">
              Acesso completo por um preço justo
            </p>
          </div>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30 max-w-md mx-auto">
            <CardHeader className="text-center pb-8">
              <Badge className="bg-emerald-500 text-white w-fit mx-auto mb-4">
                <Star className="w-4 h-4 mr-1" />
                Mais Popular
              </Badge>
              <CardTitle className="text-3xl text-white mb-2">Acesso Vitalício</CardTitle>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-white">R$ 97</span>
                <span className="text-slate-400">pagamento único</span>
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
                  <span className="text-slate-300">Sugestões para todos os níveis de risco</span>
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
                  <span className="text-slate-300">Painel de controle completo</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-300">Atualizações gratuitas para sempre</span>
                </div>
              </div>

              <Link href="/checkout" className="block">
                <Button size="lg" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-lg py-6">
                  Garantir Meu Acesso Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <p className="text-center text-sm text-slate-400">
                Pagamento único • Sem mensalidades • Acesso imediato
              </p>
            </CardContent>
          </Card>
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
              Junte-se a centenas de apostadores que já estão tomando decisões mais inteligentes com o BetSmart Pro
            </p>
            <Link href="/checkout">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-slate-100 text-lg px-8 py-6">
                Começar Agora - R$ 97
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
              <span className="text-slate-400">© 2024 BetSmart Pro. Todos os direitos reservados.</span>
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
