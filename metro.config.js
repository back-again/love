const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const emptyModulePath = path.resolve(__dirname, 'empty-module.js');

const nodeBuiltins = new Set([
  'ws',
  'net',
  'tls',
  'http',
  'https',
  'zlib',
  'stream',
  'crypto',
  'buffer',
  'url',
  'child_process',
  'fs',
  'os',
  'path',
]);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (nodeBuiltins.has(moduleName)) {
    return {
      type: 'sourceFile',
      filePath: emptyModulePath,
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
