module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // swipe animation and skia dependency
      ["@babel/plugin-proposal-decorators", { "legacy": true }]
    ]
  };
};
