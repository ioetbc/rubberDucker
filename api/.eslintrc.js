module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  overrides: [
    {
      files: ['.tsx', '.ts', '.jsx', '.js'],
    },
  ],
  extends: ['react-app', 'react-app/jest', 'plugin:prettier/recommended'],
  plugins: ['simple-import-sort'],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'simple-import-sort/imports': 0,
    'simple-import-sort/exports': 0,
    'import/no-anonymous-default-export': 0,
    arrowParens: 0,
  },
};
