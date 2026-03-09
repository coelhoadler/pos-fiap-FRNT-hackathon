import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithEmailAndPassword,
  signOut,  
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./firebase";
import type { ILoginData, ILoginResponse, IRegisterData, IRegisterResponse } from "./interfaces";

const SESSION_STORAGE_KEYS = {
  USER: 'mindease_user',
  USER_EMAIL: 'mindease_user_email',
  USER_NAME: 'mindease_user_name',
  USER_UID: 'mindease_user_uid'
};


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

export const isUserAuthenticated = (): boolean => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    return true;
  }
  return getUserFromSession() !== null;
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const getUserInfo = () => {
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



export const registerUser = async (data: IRegisterData): Promise<IRegisterResponse> => {
  try {
    if (data.senha !== data.confirmarSenha) {
      return {
        success: false,
        error: "As senhas não coincidem"
      };
    }

    if (data.senha.length < 6) {
      return {
        success: false,
        error: "A senha deve ter pelo menos 6 caracteres"
      };
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.senha
    );

    await updateProfile(userCredential.user, {
      displayName: data.nome
    });

    saveUserToSession(userCredential.user);

    return {
      success: true,
      user: userCredential.user
    };
  } catch (error: any) {
    let errorMessage = "Erro ao criar conta. Tente novamente.";

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

export const loginUser = async (data: ILoginData): Promise<ILoginResponse> => {
  try {
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

    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.senha
    );

    saveUserToSession(userCredential.user);

    return {
      success: true,
      user: userCredential.user
    };
  } catch (error: any) {
    let errorMessage = "Erro ao fazer login. Tente novamente.";

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
