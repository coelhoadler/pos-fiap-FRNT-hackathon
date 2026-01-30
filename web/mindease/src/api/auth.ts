import { 
  createUserWithEmailAndPassword, 
  updateProfile
} from "firebase/auth";
import { auth } from "./firebase";

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
