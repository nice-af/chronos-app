import { fixupPluginRules } from '@eslint/compat';
import eslintReactNative from 'eslint-plugin-react-native';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['**/*.{mjs,js}', 'ios/', 'macos/', 'windows/', 'vendor/'],
  },
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    name: 'eslint-plugin-react-native',
    plugins: {
      'react-native': fixupPluginRules({
        rules: eslintReactNative.rules,
      }),
    },
    rules: {
      ...eslintReactNative.configs.all.rules,
      'react-native/sort-styles': 'off',
      'react-native/no-inline-styles': 'warn',
    },
  },
  eslintConfigPrettier,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/prefer-namespace-keyword': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/unified-signatures': 'off',
      'array-callback-return': 'off',
      'jsx-quotes': ['error', 'prefer-single'],
      'no-extra-boolean-cast': 'off',
      'no-prototype-builtins': 'off',
      'no-throw-literal': 'off',
      'prettier/prettier': 0,
      'react-hooks/exhaustive-deps': 'off',
      'react-native/no-inline-styles': 'off',
      'react-native/split-platform-components': ['error', { iosPathRegex: '\\.(ios|macos).(js|jsx|ts|tsx)$' }],
      'react/jsx-no-useless-fragment': 'off',
      radix: 'off',
    },
  },
];
