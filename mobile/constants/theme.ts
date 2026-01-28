/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#A3BACF';

// TODO: ajustar as cores

const baseColors = {
  colorPrimary: '#0a7ea4',
  colorSecondary: '#F5EFE6',
  colorTertiary: '#687076',
  text: '#11181C',
  colorWhite: '#FFFFFF',
  colorBlack: '#000000',
  colorSuccess: '#E0EADD',
}

export const Colors = {
  light: {
    colorPrimary: baseColors.colorPrimary,
    text: baseColors.text,
    colorWhite: baseColors.colorWhite,
    colorBlack: baseColors.colorBlack,
    colorSuccess: baseColors.colorSuccess,
    background: baseColors.colorSecondary,
    buttonBackground: baseColors.colorPrimary,
    borderButton: baseColors.colorPrimary,
    tint: tintColorLight,
    icon: baseColors.colorTertiary,
    tabIconDefault: baseColors.colorTertiary,
    tabIconSelected: tintColorLight,
    textButton: baseColors.colorWhite,
    textButtonOutline: baseColors.colorPrimary,
  },
  dark: {
    colorPrimary: baseColors.colorPrimary,
    colorWhite: baseColors.colorWhite,
    colorBlack: baseColors.colorBlack,
    colorSuccess: baseColors.colorSuccess,
    text: '#F9F7F2',
    background: '#4A6572',
    buttonBackground: baseColors.colorPrimary,
    borderButton: baseColors.colorPrimary,
    tint: tintColorDark,
    icon: baseColors.colorTertiary,
    tabIconDefault: baseColors.colorTertiary,
    tabIconSelected: tintColorDark,
    textButton: baseColors.colorWhite,
    textButtonOutline: baseColors.colorPrimary,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
