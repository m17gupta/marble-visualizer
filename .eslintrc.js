module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Disable unused variable warnings/errors
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    
    // Disable unused imports warnings
    '@typescript-eslint/no-unused-imports': 'off',
    
    // Allow any type
    '@typescript-eslint/no-explicit-any': 'off',
    
    // Allow unused parameters
    '@typescript-eslint/no-unused-parameters': 'off',
    
    // Override for specific patterns if needed
    // '@typescript-eslint/no-unused-vars': [
    //   'warn',
    //   {
    //     'argsIgnorePattern': '^_',
    //     'varsIgnorePattern': '^_',
    //     'ignoreRestSiblings': true
    //   }
    // ],
  },
  overrides: [
    {
      files: ['**/*.tsx', '**/*.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        'no-unused-vars': 'off'
      }
    },
    {
      files: ['src/pages/**/*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        'no-unused-vars': 'off'
      }
    }
  ]
};
