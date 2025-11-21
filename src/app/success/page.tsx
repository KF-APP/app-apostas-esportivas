'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Trophy, 
  CheckCircle2, 
  Mail,
  Copy,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedCredentials = localStorage.getItem('palpitepro_credentials');
    if (storedCredentials) {
      setCredentials(JSON.parse(storedCredentials));
    } else {
      router.push('/');
    }
  }, [router]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogin = () => {
    // Salvar autenticação
    localStorage.setItem('palpitepro_auth', JSON.stringify({
      authenticated: true,
      username: credentials.username,
      email: credentials.email
    }));
    router.push('/dashboard');
  };

  if (!credentials) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">PalpitePro</h1>
              <p className="text-sm text-slate-400">Compra Confirmada</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Success Message */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Pagamento Confirmado!
              </h2>
              <p className="text-lg text-slate-400">
                Bem-vindo ao PalpitePro! Seu acesso foi liberado.
              </p>
            </div>
          </div>

          {/* Credentials Card */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                Suas Credenciais de Acesso
              </CardTitle>
              <CardDescription className="text-slate-400">
                Guarde estas informações em um local seguro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Email</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
                      <p className="text-white font-mono">{credentials.email}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(credentials.email)}
                      className="border-slate-700 hover:bg-slate-800"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Usuário</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
                      <p className="text-white font-mono">{credentials.username}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(credentials.username)}
                      className="border-slate-700 hover:bg-slate-800"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Senha Temporária</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
                      <p className="text-white font-mono">{credentials.password}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(credentials.password)}
                      className="border-slate-700 hover:bg-slate-800"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Você poderá alterar sua senha após o primeiro acesso
                  </p>
                </div>
              </div>

              {copied && (
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Copiado para a área de transferência!</span>
                </div>
              )}

              <Separator className="bg-slate-800" />

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                onClick={handleLogin}
              >
                Acessar Plataforma Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Email Notification */}
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-400 mb-1">Email de Confirmação Enviado</h4>
                  <p className="text-sm text-slate-300">
                    Enviamos um email para <strong>{credentials.email}</strong> com suas credenciais de acesso e instruções para começar.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Faça Login</h4>
                  <p className="text-sm text-slate-400">
                    Use suas credenciais para acessar a plataforma
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Explore os Jogos</h4>
                  <p className="text-sm text-slate-400">
                    Navegue pelos jogos do dia e veja as análises disponíveis
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Receba Palpites da IA</h4>
                  <p className="text-sm text-slate-400">
                    Veja palpites gerados por inteligência artificial baseados em dados reais
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
