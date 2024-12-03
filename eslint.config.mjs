import { storyblokLintConfig } from '@storyblok/eslint-config';

export default storyblokLintConfig({
  rules: {
    'no-console': 'off',
  },
  ignores: ['**/node_modules/**', 'cypress/', 'README.md'],
});
