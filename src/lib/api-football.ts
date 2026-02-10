// API-Football Official Integration via Next.js API Route
const API_ROUTE = '/api/football';

export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
}

export interface Fixture {
  fixture: {
    id: number;
    date: string;
    timestamp: number;
    status: {
      short: string;
      long: string;
    };
  };
  league: League;
  teams: {
    home: Team;
    away: Team;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface TeamStatistics {
  form: string;
  goals: {
    for: { total: number; average: string };
    against: { total: number; average: string };
  };
  biggest: {
    wins: { home: string; away: string };
    loses: { home: string; away: string };
  };
}

export interface APIError {
  message: string;
  code: number;
  remaining?: number;
}

async function fetchAPI(endpoint: string): Promise<any> {
  try {
    const response = await fetch(`${API_ROUTE}?endpoint=${encodeURIComponent(endpoint)}`, {
      cache: 'no-store', // Sempre buscar dados frescos
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Erro ao processar dados');
    }
    
    // Log de uso da API (útil para monitoramento)
    if (result.paging) {
      console.log(`📊 API Usage - Remaining: ${result.paging.remaining || 'N/A'}`);
    }
    
    return result.data || [];
  } catch (error) {
    // Log detalhado para debugging
    console.error('❌ API Error:', {
      endpoint,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    
    // Re-throw para tratamento no componente
    throw error;
  }
}

export async function getFixturesByDate(date: string): Promise<Fixture[]> {
  try {
    return await fetchAPI(`/fixtures?date=${date}`);
  } catch (error) {
    console.error('Erro ao buscar jogos por data:', error);
    return [];
  }
}

export async function getFixtureStatistics(fixtureId: number) {
  try {
    return await fetchAPI(`/fixtures/statistics?fixture=${fixtureId}`);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return null;
  }
}

export async function getTeamLastFixtures(teamId: number, last: number = 10) {
  try {
    return await fetchAPI(`/fixtures?team=${teamId}&last=${last}`);
  } catch (error) {
    console.error('Erro ao buscar últimos jogos:', error);
    return [];
  }
}

export async function getLeagueStandings(leagueId: number, season: number) {
  try {
    return await fetchAPI(`/standings?league=${leagueId}&season=${season}`);
  } catch (error) {
    console.error('Erro ao buscar classificação:', error);
    return null;
  }
}

export async function getFixtureOdds(fixtureId: number) {
  try {
    return await fetchAPI(`/odds?fixture=${fixtureId}`);
  } catch (error) {
    console.error('Erro ao buscar odds:', error);
    return null;
  }
}

export async function getH2H(team1Id: number, team2Id: number) {
  try {
    return await fetchAPI(`/fixtures/headtohead?h2h=${team1Id}-${team2Id}&last=10`);
  } catch (error) {
    console.error('Erro ao buscar H2H:', error);
    return [];
  }
}

// Principais ligas do mundo
export const MAJOR_LEAGUES = [
  { id: 39, name: 'Premier League', country: 'England', gender: 'M' },
  { id: 140, name: 'La Liga', country: 'Spain', gender: 'M' },
  { id: 135, name: 'Serie A', country: 'Italy', gender: 'M' },
  { id: 78, name: 'Bundesliga', country: 'Germany', gender: 'M' },
  { id: 61, name: 'Ligue 1', country: 'France', gender: 'M' },
  { id: 71, name: 'Brasileirão', country: 'Brazil', gender: 'M' },
  { id: 88, name: 'Eredivisie', country: 'Netherlands', gender: 'M' },
  { id: 94, name: 'Primeira Liga', country: 'Portugal', gender: 'M' },
  { id: 2, name: 'Champions League', country: 'Europe', gender: 'M' },
  { id: 3, name: 'Europa League', country: 'Europe', gender: 'M' },
];

// Função auxiliar para verificar saúde da API
export async function checkAPIHealth(): Promise<{ healthy: boolean; message: string }> {
  try {
    const today = new Date().toISOString().split('T')[0];
    await fetchAPI(`/fixtures?date=${today}&timezone=America/Sao_Paulo`);
    return { healthy: true, message: 'API funcionando normalmente' };
  } catch (error) {
    return { 
      healthy: false, 
      message: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}
