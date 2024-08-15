const js = require("@eslint/js");
const stylistic = require('@stylistic/eslint-plugin');
const jsdoc = require('eslint-plugin-jsdoc');
const globals = require('globals');

module.exports = [
    js.configs.recommended,
    jsdoc.configs['flat/recommended'],
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.node
            }
        },
        plugins: {
            '@stylistic': stylistic
        },
        rules: {
            "@stylistic/no-extra-semi": "warn",
            "@stylistic/array-element-newline": ["warn", "consistent"],
            "@stylistic/semi": [
                "error",
                "never"
            ],
            'jsdoc/tag-lines': 'off',
            'jsdoc/no-defaults': 'off',
            "jsdoc/sort-tags": 1,
            'no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                }
            ],
            "quotes": [
                "error",
                "single",
                {
                    "allowTemplateLiterals": true
                }
            ]
        }
    }
]
