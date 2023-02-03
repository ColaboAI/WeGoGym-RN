module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          underscore: 'lodash',
          '@': './src',
          '@image': './src/image',
          '@navigators': './src/navigators',
          '@screens': './src/screens',
          '@utils': './src/utils',
          '@store': './src/store',
          '@type': './src/type',
          '@api': './src/api',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
      },
    ],
    'react-native-reanimated/plugin',
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
