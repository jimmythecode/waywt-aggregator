module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
        'plugin:@typescript-eslint/recommended',
        // ['prettier'],
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
        '@typescript-eslint',
        // ['prettier']
        'prettier',
    ],
    rules: {
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                ts: 'never',
                tsx: 'never',
            },
        ],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        indent: 'off',
        // 'prettier/prettier': ['warn'],
        'no-unused-expressions': ['warn'],
        "react/jsx-props-no-spreading": ["off"],
        "import/prefer-default-export": ["warn"],
        "react/jsx-curly-brace-presence": ["warn"]
    },
    settings: {
        'import/resolver': {
            typescript: {},
        },
    },
};
