const { override, addWebpackPlugin } = require('customize-cra');
const webpack = require('webpack');

module.exports = override(
  // Ajouter des variables d'environnement personnalisées
  addWebpackPlugin(
    new webpack.DefinePlugin({
      'process.env.REACT_APP_VERSION': JSON.stringify(require('./package.json').version),
      'process.env.REACT_APP_NAME': JSON.stringify(require('./package.json').name),
    })
  ),
  // Configuration pour optimiser l'intégration dans Home Assistant
  (config) => {
    // Désactiver le splitting de code pour mieux fonctionner dans les iframes
    config.optimization.splitChunks = {
      cacheGroups: {
        default: false,
      },
    };
    config.optimization.runtimeChunk = false;

    // Ajuster la configuration de sortie
    config.output.filename = 'static/js/[name].js';
    config.output.chunkFilename = 'static/js/[name].chunk.js';

    return config;
  }
);