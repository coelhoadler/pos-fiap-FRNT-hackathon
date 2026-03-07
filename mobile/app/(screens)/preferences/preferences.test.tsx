import { render, screen } from "@testing-library/react-native";
import React from "react";
import Preferences from "./preferences";

jest.mock("@/app/hooks/use-color-scheme.web", () => ({
    useColorScheme: jest.fn(() => "light"),
}));

jest.mock("@/app/components/themed-view", () => {
    const { View } = require("react-native");
    return {
        ThemedView: ({ children, style, ...props }: any) => (
            <View style={style} {...props}>
                {children}
            </View>
        ),
    };
});

jest.mock("@/app/components/preferencesItems/preferencesItems", () => {
    const { View, Text } = require("react-native");
    return {
        PreferencesItems: ({ preferencesItems }: any) => (
            <View testID="preferences-items">
                {preferencesItems.map((item: any, index: number) => (
                    <Text key={index}>{item.title}</Text>
                ))}
            </View>
        ),
    };
});

describe("Preferences Screen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar a tela de preferências corretamente", () => {
        render(<Preferences />);
        
        expect(screen.getByTestId("preferences-items")).toBeTruthy();
    });
});
