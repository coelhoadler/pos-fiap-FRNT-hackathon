module.exports = {
    preset: 'jest-expo',
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
    ],
    collectCoverage: true,
    coverageReporters: ['text', 'lcov', 'clover'],
    collectCoverageFrom: [
        'app/**/*.{ts,tsx}',
        'utils/**/*.{ts,tsx}',
        '!app/**/*.test.{ts,tsx}',
        '!app/**/*.d.ts',
        '!app/**/styles.ts',
        '!app/interface/**',
        '!app/types/**',
    ],
};
