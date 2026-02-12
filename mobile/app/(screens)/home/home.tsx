import { ThemedText } from "@/app/components/themed-text";
import { ThemedView } from "@/app/components/themed-view";
import { IconSymbol } from "@/app/components/ui/icon-symbol";
import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { signOut } from "@/app/services/firebaseAuth";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

interface HamburgerMenuProps {
  children: React.ReactNode;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-DRAWER_WIDTH));
  const colorScheme = useColorScheme();

  const toggleMenu = () => {
    const toValue = isMenuOpen ? -DRAWER_WIDTH : 0;

    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();

    setIsMenuOpen(!isMenuOpen);
  };

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
      onPress: () => navigateTo("/(screens)/home/(tabs)/focus"),
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

  return (
    <View style={styles.container}>
      {/* Header com botão do menu */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
          <IconSymbol
            size={28}
            name="line.3.horizontal"
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
      </ThemedView>

      {/* Conteúdo principal */}
      <View style={styles.content}>{children}</View>

      {/* Modal do drawer */}
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
            </SafeAreaView>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  hamburgerButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
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
