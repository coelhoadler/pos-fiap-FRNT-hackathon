import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./firebase";

// Chaves para sessionStorage
const SESSION_STORAGE_KEYS = {
  USER: 'mindease_user',
  USER_EMAIL: 'mindease_user_email',
  USER_NAME: 'mindease_user_name',
  USER_UID: 'mindease_user_uid'
};

/**
 * Salva dados do usuário no sessionStorage
 */
export const saveUserToSession = (user: any) => {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEYS.USER, JSON.stringify(user));
    sessionStorage.setItem(SESSION_STORAGE_KEYS.USER_EMAIL, user.email || '');
    sessionStorage.setItem(SESSION_STORAGE_KEYS.USER_NAME, user.displayName || '');
    sessionStorage.setItem(SESSION_STORAGE_KEYS.USER_UID, user.uid || '');
  } catch (error) {
    console.error('Erro ao salvar dados no sessionStorage:', error);
  }
};

/**
 * Recupera dados do usuário do sessionStorage
 */
export const getUserFromSession = () => {
  try {
    const userStr = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  } catch (error) {
    console.error('Erro ao recuperar dados do sessionStorage:', error);
    return null;
  }
};

/**
 * Remove dados do usuário do sessionStorage
 */
export const clearUserFromSession = () => {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.USER);
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.USER_EMAIL);
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.USER_NAME);
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.USER_UID);
  } catch (error) {
    console.error('Erro ao limpar dados do sessionStorage:', error);
  }
};

/**
 * Verifica se o usuário está autenticado (verifica Firebase auth primeiro, depois sessionStorage)
 */
export const isUserAuthenticated = (): boolean => {
  // Priorizar o estado atual do Firebase
  const currentUser = auth.currentUser;
  if (currentUser) {
    return true;
  }
  // Fallback para sessionStorage
  return getUserFromSession() !== null;
};

/**
 * Obtém o usuário atual do Firebase Authentication
 * @returns Usuário atual ou null se não autenticado
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Obtém informações do usuário (prioriza Firebase, depois sessionStorage)
 */
export const getUserInfo = () => {
  // Priorizar usuário do Firebase
  const currentUser = auth.currentUser;
  if (currentUser) {
    return {
      uid: currentUser.uid,
      email: currentUser.email || '',
      displayName: currentUser.displayName || '',
      photoURL: currentUser.photoURL || null,
      emailVerified: currentUser.emailVerified,
    };
  }
  
  // Fallback para sessionStorage
  const sessionUser = getUserFromSession();
  if (sessionUser) {
    return {
      uid: sessionUser.uid || '',
      email: sessionUser.email || '',
      displayName: sessionUser.displayName || '',
      photoURL: sessionUser.photoURL || null,
      emailVerified: sessionUser.emailVerified || false,
    };
  }
  
  return null;
};

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: any;
  error?: string;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface LoginResponse {
  success: boolean;
  user?: any;
  error?: string;
}

/**
 * Registra um novo usuário no Firebase Authentication
 * @param data Dados do formulário de registro
 * @returns Promise com o resultado do registro
 */
export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
  try {
    // Validação: verificar se as senhas coincidem
    if (data.senha !== data.confirmarSenha) {
      return {
        success: false,
        error: "As senhas não coincidem"
      };
    }

    // Validação: verificar se a senha tem pelo menos 6 caracteres
    if (data.senha.length < 6) {
      return {
        success: false,
        error: "A senha deve ter pelo menos 6 caracteres"
      };
    }

    // Criar usuário com email e senha
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.senha
    );

    // Atualizar o perfil do usuário com o nome
    await updateProfile(userCredential.user, {
      displayName: data.nome
    });

    // Salvar dados do usuário no sessionStorage como backup
    saveUserToSession(userCredential.user);

    return {
      success: true,
      user: userCredential.user
    };
  } catch (error: any) {
    let errorMessage = "Erro ao criar conta. Tente novamente.";

    // Mensagens de erro
    if (error?.code) {
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Este e-mail já está em uso.";
          break;
        case "auth/invalid-email":
          errorMessage = "E-mail inválido.";
          break;
        case "auth/weak-password":
          errorMessage = "A senha é muito fraca.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Erro de conexão. Verifique sua internet.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Autentica um usuário no Firebase Authentication
 * @param data Dados do formulário de login (email e senha)
 * @returns Promise com o resultado do login
 */
export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  try {
    // Validação básica
    if (!data.email.trim()) {
      return {
        success: false,
        error: "Por favor, informe seu e-mail"
      };
    }

    if (!data.senha) {
      return {
        success: false,
        error: "Por favor, informe sua senha"
      };
    }

    // Autenticar usuário com email e senha
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.senha
    );

    // Salvar dados do usuário no sessionStorage como backup
    saveUserToSession(userCredential.user);

    return {
      success: true,
      user: userCredential.user
    };
  } catch (error: any) {
    let errorMessage = "Erro ao fazer login. Tente novamente.";

    // Mensagens de erro específicas
    if (error?.code) {
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Usuário não encontrado.";
          break;
        case "auth/wrong-password":
          errorMessage = "Senha incorreta.";
          break;
        case "auth/invalid-email":
          errorMessage = "E-mail inválido.";
          break;
        case "auth/invalid-credential":
          errorMessage = "Credenciais inválidas.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Erro de conexão. Verifique sua internet.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Muitas tentativas. Tente novamente mais tarde.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Faz logout do usuário
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    clearUserFromSession();
  } catch (error: any) {
    console.error('Erro ao fazer logout:', error);
    clearUserFromSession();
    throw error;
  }
};
