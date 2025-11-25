'use client';

import { useEffect, useState } from 'react';

/**
 * Componente que inicializa o usuário pré-registrado automaticamente
 * Deve ser incluído no layout raiz para executar em todas as páginas
 */
export function InitializePreRegisteredUser() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initUser = async () => {
      // Verificar se já foi inicializado nesta sessão
      const alreadyInitialized = sessionStorage.getItem('preregistered_user_initialized');
      
      if (alreadyInitialized) {
        setInitialized(true);
        return;
      }

      try {
        console.log('🚀 Verificando usuário pré-registrado master...');
        
        // Verificar se usuário master já existe
        const checkResponse = await fetch('/api/subscription/init-master', {
          method: 'GET',
        });
        
        const checkData = await checkResponse.json();
        
        if (!checkData.exists) {
          console.log('➕ Criando usuário pré-registrado master...');
          
          // Criar usuário master
          const createResponse = await fetch('/api/subscription/init-master', {
            method: 'POST',
          });
          
          const createData = await createResponse.json();
          
          if (createData.success) {
            console.log('✅ Usuário pré-registrado master criado com sucesso!');
          }
        } else {
          console.log('✅ Usuário pré-registrado master já existe');
        }
        
        // Marcar como inicializado nesta sessão
        sessionStorage.setItem('preregistered_user_initialized', 'true');
        setInitialized(true);
      } catch (error) {
        console.error('❌ Erro ao inicializar usuário master:', error);
        // Não bloquear a aplicação se houver erro
        setInitialized(true);
      }
    };

    initUser();
  }, []);

  // Componente invisível - apenas executa a lógica
  return null;
}
