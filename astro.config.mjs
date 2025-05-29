// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config

export default defineConfig({
  site: 'https://schnavy.github.io',
  base: '/', // Only needed if deploying to a project repo
  output: 'static'
});