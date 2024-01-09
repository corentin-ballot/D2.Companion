module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard-with-typescript",
        "plugin:react/recommended"
    ],
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        }
    },
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}",
                "*.tsx",
                "*.ts",
                "*.jsx",
                "*.js"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "ignorePatterns": [".eslintrc.js"],
    "rules": {
        // React
        'react/forbid-prop-types': 'error',
        'react/no-multi-comp': ['error', { 'ignoreStateless': true }],
        'react/no-set-state': 'error',
        'react/no-string-refs': 'error',
        'react/prefer-es6-class': 'error',
        'react/prefer-stateless-function': 'error',
        'react/require-render-return': 'error',
        'react/self-closing-comp': 'error',
        'react/sort-comp': 'error',
        'react/sort-prop-types': 'error',

        // JSX
        'react/jsx-boolean-value': 'error',
        'react/jsx-closing-bracket-location': 'error',
        'react/jsx-curly-spacing': ['error', 'always'],
        'react/jsx-equals-spacing': 'error',
        'react/jsx-first-prop-new-line': 'error',
        'react/jsx-handler-names': 'error',
        'react/jsx-indent-props': ['error', 2],
        'react/jsx-indent': ['error', 2],
        'react/jsx-key': 'error',
        'react/jsx-max-props-per-line': ['error', { 'maximum': 3 }],
        'react/jsx-no-bind': 'error',
        'react/jsx-no-literals': 'off',
        'react/jsx-no-target-blank': 'error',
        'react/jsx-pascal-case': 'error',
        'react/jsx-sort-props': 'error',
        'react/jsx-space-before-closing': 'error'
    }
}
