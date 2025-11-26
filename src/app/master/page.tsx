'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function MasterInitPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);

  const handleInit = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      console.log('🚀 Iniciando criação/atualização do usuário master...');
      
      const response = await fetch('/api/subscription/init-master', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Usuário master inicializado com sucesso!');
        setSuccess(true);
        setUserInfo(data.user);
      } else {
        console.error('❌ Erro ao inicializar:', data.error);
        setError(data.error || 'Erro ao inicializar usuário');
      }
    } catch (err) {
      console.error('❌ Erro na requisição:', err);
      setError('Erro ao processar requisição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md border-purple-500/20 bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-500/10 rounded-full">
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Inicializar Usuário Master
          </CardTitle>
          <CardDescription className="text-gray-400">
            Criar/atualizar usuário pré-registrado no sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-2 text-sm">
            <p className="text-gray-300"><strong>Email:</strong> fusquinekaique@hotmail.com</p>
            <p className="text-gray-300"><strong>Senha:</strong> Kaique24891510*</p>
            <p className="text-gray-300"><strong>Plano:</strong> Anual (12 meses)</p>
            <p className="text-gray-300"><strong>Status:</strong> Ativo</p>
          </div>

          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-green-400">
                  Usuário inicializado com sucesso!
                </p>
                {userInfo && (
                  <div className="text-xs text-green-300 space-y-1 mt-2">
                    <p>Email: {userInfo.user_email}</p>
                    <p>Nome: {userInfo.user_name}</p>
                    <p>Plano: {userInfo.plan_type}</p>
                    <p>Status: {userInfo.status}</p>
                    <p>Expira em: {new Date(userInfo.end_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
                <p className="text-xs text-green-300 mt-3">
                  Agora você pode fazer login em <a href="/login" className="underline hover:text-green-200">/login</a>
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-400">Erro ao inicializar</p>
                <p className="text-xs text-red-300 mt-1">{error}</p>
              </div>
            </div>
          )}

          <Button
            onClick={handleInit}
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Inicializando...
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Inicializado com Sucesso
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Inicializar Usuário Master
              </>
            )}
          </Button>

          {success && (
            <Button
              onClick={() => window.location.href = '/login'}
              variant="outline"
              className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              Ir para Login
            </Button>
          )}

          <div className="pt-4 border-t border-slate-700">
            <p className="text-xs text-center text-gray-500">
              Este endpoint cria/atualiza o usuário no Supabase Auth e na tabela de assinaturas
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
