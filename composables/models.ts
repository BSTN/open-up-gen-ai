import debounce from "lodash/debounce";
import categories from '@/website/categories.yml'

const projectsList = import.meta.glob('@/repos/opening-up-chatgpt-opening-up-chatgpt.github.io/projects/*.yaml', { eager: true })
let projects = ref<Array<any>>([])
for (const path in projectsList) {
  const project = projectsList[path].default
  project.path = path
  project.filename = path.split('/').pop()?.replace('.yaml','')
  if (!path.match("A_sample.yaml")) projects.value.push(project)
}

const models = ref()

sortModels(projects.value)

function bg(score) {
  if (score < 0.5) {
    return { background: `var(--score)`, '--score':  `color-mix(in srgb, var(--g1), var(--g2) ${Math.round((score * 2) * 100)}%)`}
  } else {
    return { background: `var(--score)`, '--score': `color-mix(in srgb, var(--g2), var(--g3) ${Math.round(((score - 0.5) * 2) * 100)}%)` }
  }
}

function sortModels(ppp: any) {
  // copy
  const prs = JSON.parse(JSON.stringify(ppp))

  // add weights
  prs.map((x, k) => {
    x.categories = {}
    x.params = {}
    categories.map(cat => {
      x.categories[cat.ref] = 0
      cat.params.map(param => {
        let weight = 0
        if (x[param.ref].class === 'open') {
          weight = 1
        }
        if (x[param.ref].class === 'partial') {
          weight = 0.5
        }
        if (x[param.ref].class === 'closed') {
          weight = 0
        }
        x.params[param.ref] = weight
      })
      // calculate categories (average of params)
      x.categories[cat.ref] = cat.params.map(xx => x.params[xx.ref]).reduce((a, b) => a + b) / cat.params.length
    })
    // calculate total average
    x.score = Object.values(x.params).reduce((a, b) => a + b) / Object.keys(x.params).length
  })
  // sort
  prs.sort((a, b) => {
    if (a.score > b.score) { return -1 }
    if (a.score < b.score) { return 1 }
    else {
      if (a.path > b.path) { return -1 }
      if (a.path < b.path) { return 1 }
      return 0
    }
  })
  // copy to object
  models.value = prs
}


export const useModels = () => {
  return { models, sortModels, categories, bg }
}
