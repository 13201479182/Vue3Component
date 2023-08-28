/**
 * 任何语言通用规则
 */
const commonRules = {
    // 将prettier作为插件使用,提示报警信息
    'prettier/prettier': 1,

    'for-direction': 2,
    'getter-return': 2,
    'no-async-promise-executor': 2,
    'no-compare-neg-zero': 2,
    'no-cond-assign': 2,
    'no-console': 1,
    'no-constant-condition': 2,
    'no-debugger': 1,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-empty': 2,
    'no-func-assign': 2,
    'no-inner-declarations': 2,
    'no-implicit-coercion': 2,
    'no-lone-blocks': 2,
    'no-magic-numbers': [
        2,
        {
            ignoreArrayIndexes: true,
            ignoreDefaultValues: true,
            enforceConst: true,
            ignoreClassFieldInitialValues: true,
        },
    ],
    'no-new-wrappers': 2,
    'no-param-reassign': 2,
    'no-proto': 2,
    'no-script-url': 2,
    'no-throw-literal': 2,
    'no-useless-call': 2,
    'no-useless-escape': 2,
    'prefer-named-capture-group': 2,
    'prefer-promise-reject-errors': 2,
    'require-await': 2,
    'require-unicode-regexp': 2,
    'no-warning-comments': [
        2,
        {
            terms: ['todo', 'fix'],
            location: 'start',
        },
    ],
    'yoda': 2,
    'camelcase': 2,
    'consistent-this': [2, 'self'],
    'line-comment-position': 2,
    'max-depth': [2, 4],
    'max-lines': [2, 300],
    'max-lines-per-function': [2, 30],
    'max-statements-per-line': [
        2,
        {
            max: 1,
        },
    ],
    'new-cap': 2,
    'no-mixed-operators': [
        2,
        {
            groups: [
                ['&', '|', '^', '~', '<<', '>>', '>>>'],
                ['&&', '||'],
            ],
            allowSamePrecedence: true,
        },
    ],
    'constructor-super': 2,
    'prefer-rest-params': 2,
};

/**
 * js 代码规则制定(https://eslint.org/docs/latest/rules)
 * 针对js语法规则
 */
const jsRules = {
    'no-redeclare': 2,
    'no-unused-vars': 2,
    'no-use-before-define': 2,
    'no-shadow': 2,
};

/**
 * ts 代码规则制定(https://typescript-eslint.io/rules/adjacent-overload-signatures)
 * 针对ts语法规则
 */
const tsRules = {
    '@typescript-eslint/adjacent-overload-signatures': 2,
    '@typescript-eslint/array-type': [
        2,
        {
            default: 'array',
            readonly: 'array',
        },
    ],
    '@typescript-eslint/await-thenable': 2,
    '@typescript-eslint/ban-types': 2,
    '@typescript-eslint/class-literal-property-style': [2, 'fields'],
    '@typescript-eslint/consistent-generic-constructors': [2, 'constructor'],
    '@typescript-eslint/consistent-indexed-object-style': [
        2,
        'index-signature',
    ],
    '@typescript-eslint/consistent-type-assertions': [
        2,
        {
            assertionStyle: 'as',
            objectLiteralTypeAssertions: 'allow-as-parameter',
        },
    ],
};

module.exports = {
    root: true,

    overrides: [
        // js & cjs 文件处理
        {
            files: ['*.js', '*.cjs'],
            rules: Object.assign({}, commonRules, jsRules),
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            plugins: ['prettier'],
        },

        // ts 文件处理
        {
            files: ['*.ts'],
            rules: Object.assign({}, commonRules, tsRules),
            parser: '@typescript-eslint/parser',
            parserOptions: {
                ecmaVersion: 'latest',
                project: './tsconfig.json',
            },
            plugins: ['@typescript-eslint', 'prettier'],
        },

        // vue 文件处理
        {
            files: ['*.vue'],
            parser: 'vue-eslint-parser',
            parserOptions: {
                parser: {
                    ts: '@typescript-eslint/parser',
                },
            },
            extends: ['plugin:vue/vue3-recommended', 'prettier'],
            rules: Object.assign({}, jsRules, tsRules, vueRules),
            plugins: ['eslint-plugin-vue', 'prettier'],
        },
    ],
};
