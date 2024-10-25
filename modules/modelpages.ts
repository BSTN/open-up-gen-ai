import { defineNuxtModule, extendPages, createResolver } from "nuxt/kit";
import fs from 'fs'

export default defineNuxtModule({
  meta: {
    name: 'modelpages',
  },
  setup(moduleOptions, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    fs.readdirSync(resolve('../repos/data/')).forEach(file => { 
        if (!file.match('a_submission_template.yaml') && !file.match('_parameters.yml')) {
          const filename = file.replace('.yaml', '')
          // extendPages
          extendPages((pages) => {
            pages.unshift({
              name: `model-${filename}`,
              path: `/model/${filename}`,
              file: resolve('../pages/model/[model].vue')
            })
          })
        }
      })
  }
})