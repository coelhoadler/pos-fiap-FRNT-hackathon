const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("M4A", "m4a");
config.resolver.assetExts.push("MP3", "mp3");

module.exports = config;
