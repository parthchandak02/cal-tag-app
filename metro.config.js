const { getDefaultConfig } = require('expo/metro-config');
const https = require('https');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  config.resolver.assetExts.push('mp3');

  config.resolver.fetchOptions = {
    agent: new https.Agent({ rejectUnauthorized: false })
  };

  return config;
})();
