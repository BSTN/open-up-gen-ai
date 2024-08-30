// https://nuxt.com/docs/api/configuration/nuxt-config
import ViteYaml from '@modyfi/vite-plugin-yaml';
import ViteMarkdown from 'vite-plugin-markdown';
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  content: {
    sources: {
      content: {
        driver: 'fs',
        base: './website/pages'
      }
    }
  },
  modules: [
    './modules/github.module.ts',
    '@nuxt/content',
    '@pinia/nuxt'
  ],
  github: [{
    owner: 'opening-up-chatgpt',
    repo: 'opening-up-chatgpt.github.io'
  }],
  vite: {
    css: {
      preprocessorOptions: {
        less: {
          additionalData: `@import "@/less/ease.less";@import "@/less/animations.less"; @import "@/less/global.less";`
        }
      }
    },
    plugins: [
      ViteYaml(),
      svgLoader(),
      ViteMarkdown({mode: ['html']})
    ]
  },
})
