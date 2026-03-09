import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../api/firebase';

/**
 * Hook para gerenciar o estado de autenticação do Firebase
 * @returns Objeto com o usuário atual e estado de carregamento
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Monitorar mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Limpar subscription quando o componente desmontar
    return () => unsubscribe();
  }, []);

  return { user, loading };
};
