module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: ["react-app", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
