'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Calendar,
  CalendarDays,
  TrendingUp,
  Shield,
  AlertTriangle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type FilterType = 'today' | 'tomorrow';
type RiskLevel = 'conservative' | 'medium' | 'high';

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  date: string;
  time: string;
  prediction: string;
  confidence: number;
  riskLevel: RiskLevel;
  odds: string;
  analysis: string;
}

export default function DashboardPage() {
  const [filter, setFilter] = useState<FilterType>('today');

  // Dados de exemplo - jogos de hoje
  const todayGames: Game[] = [
    {
      id: '1',
      homeTeam: 'Flamengo',
      awayTeam: 'Palmeiras',
      league: 'Brasileirão Série A',
      date: 'Hoje',
      time: '19:00',
      prediction: 'Mais de 2.5 gols',
      confidence: 87,
      riskLevel: 'conservative',
      odds: '1.85',
      analysis: 'Ambos os times têm média de 2+ gols nos últimos 5 jogos. Histórico de confrontos diretos mostra média de 3.2 gols.'
    },
    {
      id: '2',
      homeTeam: 'Corinthians',
      awayTeam: 'São Paulo',
      league: 'Brasileirão Série A',
      date: 'Hoje',
      time: '21:30',
      prediction: 'Vitória do Corinthians',
      confidence: 72,
      riskLevel: 'medium',
      odds: '2.10',
      analysis: 'Corinthians venceu 4 dos últimos 5 jogos em casa. São Paulo com desfalques importantes na defesa.'
    },
    {
      id: '3',
      homeTeam: 'Internacional',
      awayTeam: 'Grêmio',
      league: 'Brasileirão Série A',
      date: 'Hoje',
      time: '16:00',
      prediction: 'Ambos marcam',
      confidence: 79,
      riskLevel: 'conservative',
      odds: '1.75',
      analysis: 'Clássico Grenal historicamente com muitos gols. Ambos marcaram em 8 dos últimos 10 confrontos.'
    }
  ];

  // Dados de exemplo - jogos de amanhã
  const tomorrowGames: Game[] = [
    {
      id: '4',
      homeTeam: 'Atlético-MG',
      awayTeam: 'Fluminense',
      league: 'Brasileirão Série A',
      date: 'Amanhã',
      time: '18:30',
      prediction: 'Menos de 2.5 gols',
      confidence: 81,
      riskLevel: 'conservative',
      odds: '1.90',
      analysis: 'Fluminense com a melhor defesa do campeonato. Atlético-MG com dificuldades ofensivas nos últimos jogos.'
    },
    {
      id: '5',
      homeTeam: 'Botafogo',
      awayTeam: 'Vasco',
      league: 'Brasileirão Série A',
      date: 'Amanhã',
      time: '20:00',
      prediction: 'Vitória do Botafogo',
      confidence: 85,
      riskLevel: 'conservative',
      odds: '1.65',
      analysis: 'Botafogo invicto há 8 jogos em casa. Vasco com 5 derrotas consecutivas como visitante.'
    },
    {
      id: '6',
      homeTeam: 'Santos',
      awayTeam: 'Cruzeiro',
      league: 'Brasileirão Série A',
      date: 'Amanhã',
      time: '21:45',
      prediction: 'Empate',
      confidence: 68,
      riskLevel: 'high',
      odds: '3.20',
      analysis: 'Times equilibrados tecnicamente. Últimos 4 confrontos terminaram empatados.'
    },
    {
      id: '7',
      homeTeam: 'Athletico-PR',
      awayTeam: 'Bahia',
      league: 'Brasileirão Série A',
      date: 'Amanhã',
      time: '19:30',
      prediction: 'Mais de 2.5 gols',
      confidence: 76,
      riskLevel: 'medium',
      odds: '1.95',
      analysis: 'Athletico-PR com média de 2.8 gols por jogo em casa. Bahia sofreu gols em todos os últimos 7 jogos.'
    }
  ];

  const games = filter === 'today' ? todayGames : tomorrowGames;

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'conservative':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const getRiskIcon = (risk: RiskLevel) => {
    switch (risk) {
      case 'conservative':
        return <Shield className="w-4 h-4" />;
      case 'medium':
        return <TrendingUp className="w-4 h-4" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getRiskLabel = (risk: RiskLevel) => {
    switch (risk) {
      case 'conservative':
        return 'Conservador';
      case 'medium':
        return 'Médio';
      case 'high':
        return 'Alto Risco';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="hover:bg-slate-800">
                  <ArrowLeft className="w-5 h-5 text-slate-400" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">PalpitePro</h1>
                  <p className="text-sm text-slate-400">Dashboard de Palpites</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Filtrar Jogos</h2>
                  <p className="text-sm text-slate-400">Escolha o período que deseja visualizar</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    variant={filter === 'today' ? 'default' : 'outline'}
                    className={filter === 'today' 
                      ? 'bg-emerald-600 hover:bg-emerald-700 flex-1 sm:flex-none' 
                      : 'border-slate-700 hover:bg-slate-800 flex-1 sm:flex-none'
                    }
                    onClick={() => setFilter('today')}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Hoje
                  </Button>
                  <Button
                    variant={filter === 'tomorrow' ? 'default' : 'outline'}
                    className={filter === 'tomorrow' 
                      ? 'bg-emerald-600 hover:bg-emerald-700 flex-1 sm:flex-none' 
                      : 'border-slate-700 hover:bg-slate-800 flex-1 sm:flex-none'
                    }
                    onClick={() => setFilter('tomorrow')}
                  >
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Jogos de amanhã
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Total de Jogos</p>
                  <p className="text-3xl font-bold text-white">{games.length}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Confiança Média</p>
                  <p className="text-3xl font-bold text-white">
                    {Math.round(games.reduce((acc, game) => acc + game.confidence, 0) / games.length)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Palpites Conservadores</p>
                  <p className="text-3xl font-bold text-white">
                    {games.filter(g => g.riskLevel === 'conservative').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Games List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">
              {filter === 'today' ? 'Jogos de Hoje' : 'Jogos de Amanhã'}
            </h3>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              Analisado por IA
            </Badge>
          </div>

          {games.map((game) => (
            <Card key={game.id} className="bg-slate-900/50 border-slate-800 hover:border-emerald-600/50 transition-all">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Game Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>{game.date} • {game.time}</span>
                      </div>
                      <Badge variant="outline" className="border-slate-700 text-slate-300">
                        {game.league}
                      </Badge>
                    </div>
                    <Badge className={getRiskColor(game.riskLevel)}>
                      {getRiskIcon(game.riskLevel)}
                      <span className="ml-2">{getRiskLabel(game.riskLevel)}</span>
                    </Badge>
                  </div>

                  {/* Teams */}
                  <div className="flex items-center justify-center gap-4 py-4">
                    <div className="text-center flex-1">
                      <p className="text-xl font-bold text-white">{game.homeTeam}</p>
                    </div>
                    <div className="text-2xl font-bold text-slate-600">VS</div>
                    <div className="text-center flex-1">
                      <p className="text-xl font-bold text-white">{game.awayTeam}</p>
                    </div>
                  </div>

                  {/* Prediction */}
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Palpite da IA</p>
                        <p className="text-lg font-bold text-emerald-400">{game.prediction}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400 mb-1">Confiança</p>
                        <p className="text-lg font-bold text-white">{game.confidence}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400 mb-1">Odd</p>
                        <p className="text-lg font-bold text-blue-400">{game.odds}</p>
                      </div>
                    </div>

                    {/* Confidence Bar */}
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
                        style={{ width: `${game.confidence}%` }}
                      />
                    </div>
                  </div>

                  {/* Analysis */}
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                    <p className="text-sm font-semibold text-slate-300 mb-2">Análise da IA:</p>
                    <p className="text-sm text-slate-400 leading-relaxed">{game.analysis}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {games.length === 0 && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Nenhum jogo encontrado</h3>
              <p className="text-slate-400">
                Não há jogos programados para {filter === 'today' ? 'hoje' : 'amanhã'}.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
