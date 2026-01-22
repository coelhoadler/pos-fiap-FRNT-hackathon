import { Colors } from "../../../constants/theme";
import { StyleSheet } from "react-native";

export function styles(colorScheme: 'light' | 'dark' = 'dark') {
    const colors = Colors[colorScheme];

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        content: {
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 30,
        },
        logoContainer: {
            alignItems: 'center',
            marginBottom: 30,
        },
        logo: {
            width: 120,
            height: 120,
            resizeMode: 'contain',
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 5,
        },
        subtitle: {
            fontSize: 16,
            color: colors.text,
            marginBottom: 40,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFF',
            borderWidth: 1,
            borderColor: '#E0E0E0',
            borderRadius: 12,
            paddingHorizontal: 15,
            height: 55,
            marginBottom: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 3.84,
            elevation: 2,
        },
        icon: {
            marginRight: 10,
        },
        input: {
            flex: 1,
            fontSize: 16,
            color: '#333',
            height: '100%',
        },
        loginButton: {
            backgroundColor: colors.buttonBackground,
            borderRadius: 12,
            height: 55,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
        },
        loginButtonText: {
            color: '#FFF',
            fontSize: 16,
            fontWeight: 'bold',
            letterSpacing: 1,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 30,
        },
        footerText: {
            color: colors.text,
            fontSize: 14,
        },
        signupText: {
            color: colors.tint,
            fontSize: 14,
            fontWeight: 'bold',
        },
    });
}
