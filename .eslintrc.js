module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  rules: {
    // Disable the rule globally (or adjust as needed)
    "@typescript-eslint/no-explicit-any": "off",
  },
};
