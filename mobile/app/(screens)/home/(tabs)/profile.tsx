import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ProfileAvatar } from "@/components/profile-avatar";
import getCurrentUser from "@/app/services/firebaseAuth";

export default function ProfileScreen() {
    const user = getCurrentUser();

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
                                ? new Date(user.metadata.creationTime).toLocaleDateString('pt-BR')
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
});
