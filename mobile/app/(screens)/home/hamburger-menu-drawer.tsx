import { ProfileAvatar } from "@/app/components/profile-avatar";
import { ThemedText } from "@/app/components/themed-text";
import { IconSymbol } from "@/app/components/ui/icon-symbol";
import { Colors } from "@/app/constants/theme";
import { useColorScheme } from "@/app/hooks/use-color-scheme";
import { getAuth, signOut } from "@/app/services/firebaseAuth";
import { router } from "expo-router";
import { FileCheckCorner, Timer } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMenu } from "./menu-context";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.75;

interface MenuItemProps {
  icon: string | React.ReactElement;
  label: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onPress }) => {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      {typeof icon === "string" ? (
        <IconSymbol
          size={24}
          name={icon as any}
          color={Colors[colorScheme ?? "light"].text}
        />
      ) : (
        icon
      )}
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

  const getCurrentUser = (): { name?: string; email?: string } | undefined => {
    const auth = getAuth();
    if (auth.currentUser) {
      return {
        name: auth.currentUser.displayName || "",
        email: auth.currentUser.email || "",
      };
    }
  };

  const menuItems = [
    {
      icon: "house.fill",
      label: "Início",
      onPress: () => navigateTo("/(screens)/home/(tabs)/"),
    },
    {
      icon: <Timer size={24} />,
      label: "Focar",
      onPress: () => navigateTo("/(screens)/home/(tabs)/focus"),
    },
    {
      icon: <FileCheckCorner size={22} />,
      label: "Projetos",
      onPress: () => navigateTo("/(screens)/home/(tabs)/projects/projects"),
    },
    {
      icon: "gearshape.fill",
      label: "Preferências",
      onPress: () => navigateTo("/(screens)/home/(tabs)/modal"),
    },
    {
      icon: "person.circle.fill",
      label: "Perfil",
      onPress: () => navigateTo("/(screens)/home/(tabs)/profile"),
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
              <View style={styles.drawerHeaderImage}>
                <ProfileAvatar size={75} editable={false} />
              </View>
              <View style={styles.drawerHeaderInfo}>
                <View>
                  <Text
                    style={styles.nameText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {getCurrentUser()?.name}
                  </Text>
                  <Text
                    style={styles.emailText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {getCurrentUser()?.email}
                  </Text>
                  <Text style={styles.closeMenuText} onPress={toggleMenu}>
                    Fechar Menu
                  </Text>
                </View>
              </View>
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
              <ThemedText style={styles.footerText}>MindEase v1.0</ThemedText>
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  drawerHeaderImage: {
    paddingRight: 16,
  },
  drawerHeaderInfo: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "600",
  },
  emailText: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  closeMenuText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1E90FF",
    textDecorationLine: "underline",
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
