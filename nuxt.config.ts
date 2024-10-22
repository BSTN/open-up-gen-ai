// https://nuxt.com/docs/api/configuration/nuxt-config
import ViteYaml from '@modyfi/vite-plugin-yaml';
import ViteMarkdown from 'vite-plugin-markdown';
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  // app: {
  //   pageTransition: {
  //     name: 'page',
  //     mode: 'out-in',
  //     onEnter: (el) => {
  //       console.log(el)
  //     }
  //   }
  // },
  i18n: {
    baseUrl: 'http://localhost:4444',
    strategy: 'no_prefix',
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        language: 'en-US'
      },
      {
        code: 'nl',
        language: 'nl-NL'
      }
    ]
  },
  content: {
    sources: {
      content: {
        driver: 'fs',
        base: './website/pages'
      }
    }
  },
  modules: [// './modules/extend-pages-module/extendpages.ts',
  ['./modules/github.module', {
    repositories: [{
    name: 'data',
    // owner: 'opening-up-chatgpt',
    // repo: 'opening-up-chatgpt.github.io',
    owner: 'Language-Technology-Assessment',
    repo: 'main-database',
    }, {
    name: 'website',
    owner: 'BSTN',
    repo: 'open-up-gen-ai',
  }]
  }], '@nuxt/content', '@pinia/nuxt', '@nuxt/image', '@nuxtjs/i18n'],
  image: {
    dir: 'website',
  },
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
      svgLoader({
        svgoConfig: {
          multipass: true,
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  // @see https://github.com/svg/svgo/issues/1128
                  removeViewBox: false,
                },
              },
            },
          ],
        },
      }),
      ViteMarkdown({mode: ['html']})
    ]
  },
})