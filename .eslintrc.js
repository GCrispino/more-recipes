module.exports = {
  extends: ["airbnb-base", "prettier"],
  plugins: ["prettier"],
  env: { jest: true },
  rules: {
    "prettier/prettier": ["error"],
    "no-unused-vars": [
      2,
      { argsIgnorePattern: "^_*$", varsIgnorePattern: "^_*$" }
    ]
  }
};
