import storage from "@react-native-firebase/storage";
import getCurrentUser from "./firebaseAuth";

/**
 * Faz upload da imagem de perfil do usuário para o Firebase Storage
 * @param imageUri - URI local da imagem selecionada
 * @returns URL de download da imagem
 */
export async function uploadProfileImage(imageUri: string): Promise<string> {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error("Usuário não autenticado");
  }

  const userId = currentUser.uid;
  const filename = `profile-${userId}.jpg`;
  const reference = storage().ref(`avatars/${filename}`);

  try {
    // Upload do arquivo
    await reference.putFile(imageUri);
    
    // Obter URL de download
    const downloadURL = await reference.getDownloadURL();
    
    return downloadURL;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw error;
  }
}

/**
 * Obtém a URL da imagem de perfil do usuário
 * @returns URL da imagem ou null se não existir
 */
export async function getProfileImageURL(): Promise<string | null> {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return null;
  }

  const userId = currentUser.uid;
  const filename = `profile-${userId}.jpg`;
  const reference = storage().ref(`avatars/${filename}`);

  try {
    const downloadURL = await reference.getDownloadURL();
    return downloadURL;
  } catch (error) {
    // Imagem não existe
    return null;
  }
}

/**
 * Deleta a imagem de perfil do usuário
 */
export async function deleteProfileImage(): Promise<void> {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error("Usuário não autenticado");
  }

  const userId = currentUser.uid;
  const filename = `profile-${userId}.jpg`;
  const reference = storage().ref(`avatars/${filename}`);

  try {
    await reference.delete();
  } catch (error) {
    console.error("Erro ao deletar imagem:", error);
    throw error;
  }
}
