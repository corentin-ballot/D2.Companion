module.exports = {
    env: {
        browser: true,
        es2021: true,
        "jest/globals": true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "airbnb",
        "prettier",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            'jsx': true
        },
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint", "jest"],
    settings: {
        "import/resolver": {
            node: {
                extensions: [".ts", ".tsx", ".js", ".jsx"],
            },
        },
    },
    // ignorePatterns: [".eslintrc.js"],
    "rules": {
        "no-underscore-dangle": "off",
        "react/jsx-props-no-spreading": "off",
        "react/react-in-jsx-scope": "off",
        "react/require-default-props": "off",
        "react/function-component-definition": [
            2,
            {
                namedComponents: "arrow-function",
            },
        ],
        "react/jsx-filename-extension": [
            1,
            {
                extensions: [".ts", ".tsx", ".jsx"],
            },
        ],
        "import/extensions": [
            "error",
            "ignorePackages",
            {
                ts: "never",
                tsx: "never",
            },
        ],
    }
}
