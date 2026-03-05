const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("M4A", "m4a");
config.resolver.assetExts.push("MP3", "mp3");

config.resolver.blockList = [
    ...(Array.isArray(config.resolver.blockList)
        ? config.resolver.blockList
        : config.resolver.blockList
            ? [config.resolver.blockList]
            : []),
    /\.test\.(ts|tsx|js|jsx)$/,
];

module.exports = config;
