import { ProfileAvatar } from "@/app/components/profile-avatar";
import { ThemedText } from "@/app/components/themed-text";
import { ThemedView } from "@/app/components/themed-view";
import getCurrentUser, { updateUserProfile } from "@/app/services/firebaseAuth";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProfileScreen() {
  const user = getCurrentUser();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDisplayName(user?.displayName || "");
  }, [user?.displayName]);

  const handleSaveDisplayName = async () => {
    if (!displayName.trim()) {
      Alert.alert("Erro", "O nome não pode estar vazio");
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfile({ displayName: displayName.trim() });
      setIsEditing(false);
      Alert.alert("Sucesso", "Nome atualizado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o nome");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setDisplayName(user?.displayName || "");
    setIsEditing(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <ProfileAvatar size={150} editable={true} />
        </View>

        <View style={styles.infoSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Informações do Perfil
          </ThemedText>

          <View style={styles.infoItem}>
            <ThemedText style={styles.label}>Nome:</ThemedText>
            {isEditing ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.input}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Digite seu nome"
                  placeholderTextColor="#999"
                  maxLength={50}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleCancelEdit}
                    disabled={isSaving}
                  >
                    <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSaveDisplayName}
                    disabled={isSaving}
                  >
                    <ThemedText style={styles.buttonText}>
                      {isSaving ? "Salvando..." : "Salvar"}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.displayContainer}>
                <ThemedText style={styles.value}>
                  {user?.displayName || "Não definido"}
                </ThemedText>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                >
                  <ThemedText style={styles.editButtonText}>Editar</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.infoItem}>
            <ThemedText style={styles.label}>Email:</ThemedText>
            <ThemedText style={styles.value}>
              {user?.email || "Não disponível"}
            </ThemedText>
          </View>

          <View style={styles.infoItem}>
            <ThemedText style={styles.label}>ID do usuário:</ThemedText>
            <ThemedText style={styles.value} numberOfLines={1}>
              {user?.uid || "Não disponível"}
            </ThemedText>
          </View>

          <View style={styles.infoItem}>
            <ThemedText style={styles.label}>Data de criação:</ThemedText>
            <ThemedText style={styles.value}>
              {user?.metadata.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString(
                    "pt-BR",
                  )
                : "Não disponível"}
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  infoSection: {
    marginTop: 20,
  },
  sectionTitle: {
    marginBottom: 20,
  },
  infoItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
  },
  editContainer: {
    marginTop: 8,
  },
  displayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    color: "#000",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  cancelButton: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: "#007AFF",
    borderRadius: 6,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
