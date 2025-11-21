'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trophy, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulação de autenticação
      // Em produção, você integraria com um backend real (Supabase, Firebase, etc)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validação básica
      if (!email || !password) {
        throw new Error('Por favor, preencha todos os campos');
      }

      if (!email.includes('@')) {
        throw new Error('Email inválido');
      }

      if (password.length < 6) {
        throw new Error('Senha deve ter no mínimo 6 caracteres');
      }

      // Simular login bem-sucedido
      // Salvar token/sessão no localStorage
      localStorage.setItem('palpitepro_auth', JSON.stringify({
        email,
        authenticated: true,
        timestamp: Date.now()
      }));

      // Redirecionar para o dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo e Título */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">PalpitePro</h1>
          <p className="text-slate-400">Faça login para acessar seus palpites</p>
        </div>

        {/* Card de Login */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-center">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Erro */}
              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/30">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Botão de Login */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>

              {/* Links Auxiliares */}
              <div className="text-center space-y-2">
                <button
                  type="button"
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                  onClick={() => alert('Funcionalidade de recuperação de senha em desenvolvimento')}
                >
                  Esqueceu sua senha?
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informação Adicional */}
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm text-blue-300 font-semibold">
                  Acesso Premium
                </p>
                <p className="text-xs text-blue-200/80">
                  Esta é uma área exclusiva para usuários que adquiriram o aplicativo. 
                  Após a compra, você receberá suas credenciais de acesso por email.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500">
          © 2024 PalpitePro. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
