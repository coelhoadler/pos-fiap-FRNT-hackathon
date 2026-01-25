import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated,
    Dimensions,
    Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { signOut } from "@/app/services/firebaseAuth";
import { router } from "expo-router";
import { useMenu } from "./menu-context";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.75;

interface MenuItemProps {
    icon: string;
    label: string;
    onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onPress }) => {
    const colorScheme = useColorScheme();

    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <IconSymbol
                size={24}
                name={icon as any}
                color={Colors[colorScheme ?? "light"].text}
            />
            <ThemedText style={styles.menuItemText}>{label}</ThemedText>
        </TouchableOpacity>
    );
};

export const HamburgerMenuDrawer: React.FC = () => {
    const { isMenuOpen, toggleMenu } = useMenu();
    const [slideAnim] = useState(new Animated.Value(-DRAWER_WIDTH));
    const colorScheme = useColorScheme();

    useEffect(() => {
        const toValue = isMenuOpen ? 0 : -DRAWER_WIDTH;

        Animated.spring(slideAnim, {
            toValue,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
        }).start();
    }, [isMenuOpen]);

    const handleSignOut = async () => {
        toggleMenu();
        await signOut();
    };

    const navigateTo = (route: string) => {
        toggleMenu();
        router.push(route as any);
    };

    const menuItems = [
        {
            icon: "house.fill",
            label: "Início",
            onPress: () => navigateTo("/(screens)/home/(tabs)/"),
        },
        {
            icon: "paperplane.fill",
            label: "Focar",
            onPress: () => navigateTo("/(screens)/home/(tabs)/explore"),
        },
        {
            icon: "gearshape.fill",
            label: "Preferências",
            onPress: () => navigateTo("/(screens)/home/(tabs)/modal"),
        },
        {
            icon: "person.circle.fill",
            label: "Perfil",
            onPress: () => {
                toggleMenu();
                // Adicione navegação para perfil aqui
            },
        },
        {
            icon: "arrow.right.square.fill",
            label: "Sair",
            onPress: handleSignOut,
        },
    ];

    if (!isMenuOpen) return null;

    return (
        <Modal
            visible={isMenuOpen}
            transparent
            animationType="none"
            onRequestClose={toggleMenu}
        >
            <Pressable style={styles.overlay} onPress={toggleMenu}>
                <Animated.View
                    style={[
                        styles.drawer,
                        {
                            backgroundColor: Colors[colorScheme ?? "light"].background,
                            transform: [{ translateX: slideAnim }],
                        },
                    ]}
                    onStartShouldSetResponder={() => true}
                >
                    <SafeAreaView style={styles.drawerContent}>
                        {/* Header do drawer */}
                        <View style={styles.drawerHeader}>
                            <ThemedText type="title">Menu</ThemedText>
                            <TouchableOpacity onPress={toggleMenu}>
                                <IconSymbol
                                    size={24}
                                    name="xmark"
                                    color={Colors[colorScheme ?? "light"].text}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Divisor */}
                        <View
                            style={[
                                styles.divider,
                                { backgroundColor: Colors[colorScheme ?? "light"].icon },
                            ]}
                        />

                        {/* Items do menu */}
                        <View style={styles.menuItems}>
                            {menuItems.map((item, index) => (
                                <MenuItem
                                    key={index}
                                    icon={item.icon}
                                    label={item.label}
                                    onPress={item.onPress}
                                />
                            ))}
                        </View>

                        {/* Footer */}
                        <View style={styles.drawerFooter}>
                            <ThemedText style={styles.footerText}>
                                MindEase v1.0
                            </ThemedText>
                        </View>
                    </SafeAreaView>
                </Animated.View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    drawer: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        elevation: 16,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    drawerContent: {
        flex: 1,
        paddingTop: 16,
    },
    drawerHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    divider: {
        height: 1,
        opacity: 0.2,
    },
    menuItems: {
        flex: 1,
        paddingTop: 8,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 16,
    },
    menuItemText: {
        fontSize: 16,
    },
    drawerFooter: {
        padding: 20,
        alignItems: "center",
    },
    footerText: {
        fontSize: 12,
        opacity: 0.6,
    },
});
