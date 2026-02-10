import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || 'e30eca76e3c6fd75c8e6757be93e26e5';

// Rate limiting
let requestCount = 0;
let lastResetTime = Date.now();
const MAX_REQUESTS_PER_MINUTE = 30;

function checkRateLimit(): boolean {
  const now = Date.now();
  const timeSinceReset = now - lastResetTime;
  
  if (timeSinceReset >= 60000) {
    requestCount = 0;
    lastResetTime = now;
  }
  
  return requestCount < MAX_REQUESTS_PER_MINUTE;
}

export async function GET(request: NextRequest) {
  try {
    // Verificar rate limit
    if (!checkRateLimit()) {
      return NextResponse.json(
        { error: 'Rate limit excedido. Aguarde um momento.' },
        { status: 429 }
      );
    }
    
    requestCount++;
    
    // Pegar o endpoint da query string
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint');
    
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint não especificado' },
        { status: 400 }
      );
    }
    
    // Fazer requisição para API Football
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'x-apisports-key': API_KEY,
      },
      next: { revalidate: 300 }, // Cache por 5 minutos
    });

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Limite de requisições atingido na API externa.' },
          { status: 429 }
        );
      }
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Chave API inválida.' },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: `Erro na API: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Verificar erros na resposta
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error('API Errors:', data.errors);
      return NextResponse.json(
        { error: 'Erro ao processar dados da API.' },
        { status: 500 }
      );
    }
    
    // Retornar apenas a resposta relevante
    return NextResponse.json({
      success: true,
      data: data.response || [],
      paging: data.paging || null,
    });
    
  } catch (error) {
    console.error('❌ API Route Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    
    return NextResponse.json(
      { error: 'Erro interno ao processar requisição.' },
      { status: 500 }
    );
  }
}
