import React, { useState, useEffect } from "react";
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
    Alert,
    Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    uploadProfileImage,
    getProfileImageURL,
    deleteProfileImage,
} from "@/app/services/firebaseStorage";

interface ProfileAvatarProps {
    size?: number;
    editable?: boolean;
    onImageUpdate?: (imageUrl: string | null) => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
    size = 120,
    editable = true,
    onImageUpdate,
}) => {
    const colorScheme = useColorScheme();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        loadProfileImage();
    }, []);

    const loadProfileImage = async () => {
        try {
            const url = await getProfileImageURL();
            setImageUrl(url);
            onImageUpdate?.(url);
        } catch (error) {
            console.error("Erro ao carregar imagem:", error);
        } finally {
            setInitialLoading(false);
        }
    };

    const requestPermissions = async () => {
        if (Platform.OS !== "web") {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permissão necessária",
                    "Precisamos de permissão para acessar suas fotos."
                );
                return false;
            }
        }
        return true;
    };

    const pickImage = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                await uploadImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Erro ao selecionar imagem:", error);
            Alert.alert("Erro", "Não foi possível selecionar a imagem.");
        }
    };

    const takePhoto = async () => {
        if (Platform.OS === "web") {
            Alert.alert("Não suportado", "Câmera não disponível na web.");
            return;
        }

        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permissão necessária",
                "Precisamos de permissão para acessar a câmera."
            );
            return;
        }

        try {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                await uploadImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Erro ao tirar foto:", error);
            Alert.alert("Erro", "Não foi possível tirar a foto.");
        }
    };

    const uploadImage = async (uri: string) => {
        setLoading(true);
        try {
            const downloadURL = await uploadProfileImage(uri);
            setImageUrl(downloadURL);
            onImageUpdate?.(downloadURL);
            Alert.alert("Sucesso", "Imagem atualizada com sucesso!");
        } catch (error) {
            console.error("Erro ao fazer upload:", error);
            Alert.alert("Erro", "Não foi possível fazer upload da imagem.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = async () => {
        Alert.alert(
            "Remover foto",
            "Tem certeza que deseja remover sua foto de perfil?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await deleteProfileImage();
                            setImageUrl(null);
                            onImageUpdate?.(null);
                            Alert.alert("Sucesso", "Foto removida com sucesso!");
                        } catch (error) {
                            console.error("Erro ao remover imagem:", error);
                            Alert.alert("Erro", "Não foi possível remover a imagem.");
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const showImageOptions = () => {
        const options = imageUrl
            ? ["Escolher da galeria", "Tirar foto", "Remover foto", "Cancelar"]
            : ["Escolher da galeria", "Tirar foto", "Cancelar"];

        Alert.alert("Foto de perfil", "Escolha uma opção", [
            {
                text: "Escolher da galeria",
                onPress: pickImage,
            },
            ...(Platform.OS !== "web"
                ? [
                    {
                        text: "Tirar foto",
                        onPress: takePhoto,
                    },
                ]
                : []),
            ...(imageUrl
                ? [
                    {
                        text: "Remover foto",
                        onPress: handleRemoveImage,
                        style: "destructive" as const,
                    },
                ]
                : []),
            {
                text: "Cancelar",
                style: "cancel" as const,
            },
        ]);
    };

    if (initialLoading) {
        return (
            <View style={[styles.container, { width: size, height: size }]}>
                <View
                    style={[
                        styles.placeholder,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            backgroundColor: Colors[colorScheme ?? "light"].icon + "20",
                        },
                    ]}
                >
                    <ActivityIndicator size="small" color={Colors[colorScheme ?? "light"].tint} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={editable ? showImageOptions : undefined}
                disabled={loading || !editable}
                activeOpacity={0.8}
            >
                <View style={{ width: size, height: size }}>
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={[
                                styles.avatar,
                                {
                                    width: size,
                                    height: size,
                                    borderRadius: size / 2,
                                },
                            ]}
                        />
                    ) : (
                        <View
                            style={[
                                styles.placeholder,
                                {
                                    width: size,
                                    height: size,
                                    borderRadius: size / 2,
                                    backgroundColor: Colors[colorScheme ?? "light"].icon + "20",
                                },
                            ]}
                        >
                            <IconSymbol
                                size={size * 0.5}
                                name="person.circle.fill"
                                color={Colors[colorScheme ?? "light"].icon}
                            />
                        </View>
                    )}

                    {loading && (
                        <View
                            style={[
                                styles.loadingOverlay,
                                {
                                    width: size,
                                    height: size,
                                    borderRadius: size / 2,
                                },
                            ]}
                        >
                            <ActivityIndicator size="small" color="#fff" />
                        </View>
                    )}

                    {editable && !loading && (
                        <View
                            style={[
                                styles.editButton,
                                {
                                    backgroundColor: Colors[colorScheme ?? "light"].tint,
                                },
                            ]}
                        >
                            <IconSymbol
                                size={16}
                                name="pencil"
                                color="#fff"
                            />
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            {editable && !loading && (
                <ThemedText style={styles.editText}>Toque para editar</ThemedText>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    avatar: {
        resizeMode: "cover",
    },
    placeholder: {
        justifyContent: "center",
        alignItems: "center",
    },
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    editButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#fff",
    },
    editText: {
        marginTop: 8,
        fontSize: 12,
        opacity: 0.7,
    },
});
