import { storyblokLintConfig } from '@storyblok/eslint-config';

export default storyblokLintConfig({
  rules: {
    'no-console': 'off',
    'vue/max-attributes-per-line': 'off',
  },
  vue: true,
  ignores: ['**/node_modules/**', 'cypress/', 'README.md'],
});
