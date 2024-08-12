<template>
  <div class="compare">
    <!-- <div @click="rand = Math.random()">{{ rand }}</div> -->
    <div class="categories">
      <div class="frame">
        <div class="category" v-for="category in categories">
          <div class="cat-name">{{ category.name }}</div>
          <div class="params">
            <div class="param" v-for="param in category.params">{{ param.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="projectlist">
      <div class="project" v-for="item in projectsSorted" :key="item.path">
        <div class="info">
          <NuxtLink :to="item.project.link" class="name">{{ item.project.name || '(undefined)' }}</NuxtLink>
          <!-- <div class="notes">{{ item.project.notes }}</div>
          <NuxtLink :to="item.org.link" class="org">{{ item.org.name }}</NuxtLink>
          <div class="llmbase">{{ item.project.llmbase }}</div>
          <div class="rlbase">{{ item.project.rlbase }}</div>
          <div class="license">{{ item.project.license }}</div> -->
        </div>
        <div class="data">
          <div class="category" v-for="category in categories">
            <!-- <div class="cat-name">{{ category }}</div> -->
            <div class="params">
              <div class="param" v-for="param in category.params">
                <div class="param-name">{{ param.name }}</div>
                <div class='circle-icon open-icon' v-if="item[param.ref].class === 'open'" v-html="openIcon"></div>
                <div class='circle-icon closed-icon' v-if="item[param.ref].class === 'closed'" v-html="closedIcon">
                </div>
                <div class='circle-icon partial-icon' v-if="item[param.ref].class === 'partial'" v-html="partialIcon">
                </div>
                <!-- <div class="hover">
                  <div class="param-hover-name">{{ param.name }}</div>
                  <div class='notes' v-html="item[param.ref].notes">
                  </div>
                  <NuxtLink :to="item[param.ref].link">{{ item[param.ref].link }}</NuxtLink>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import categories from '@/website/categories.yml'
import openIcon from '@/assets/icons/open.svg?raw'
import closedIcon from '@/assets/icons/closed.svg?raw'
import partialIcon from '@/assets/icons/partial.svg?raw'
import debounce from "lodash/debounce";
const rand = ref('random')

const projectsList = import.meta.glob('@/repos/opening-up-chatgpt-opening-up-chatgpt.github.io/projects/*.yaml')
let projects = ref<Array<any>>([])
for (const path in projectsList) {
  projectsList[path]().then((mod) => {
    const project = mod.default
    project.path = path
    project.filename = path.split('/').pop()
    if (!path.match("A_sample.yaml")) projects.value.push(project)
  })
}

const projectsSorted = ref(projects)

watch([rand], debounce(() => {
  sortProjects()
}, 500), { deep: true })

function sortProjects() {
  // copy
  const prs = JSON.parse(JSON.stringify(projects.value))
  // add weights
  prs.map(x => {
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
      x.categories[cat.ref] = Object.values(x.params).reduce((a, b) => a + b) / Object.keys(x.params).length
    })
    // calculate total average
    x.score = Object.values(x.categories).reduce((a, b) => a + b) / Object.keys(x.categories).length
  })
  // sort
  prs.sort((a, b) => a.score > b.score ? -1 : 1)
  // copy to object
  projectsSorted.value = prs
}

onMounted(() => {
  setTimeout(sortProjects, 500)
})
</script>

<style lang="less" scoped>
@namesize: 14rem;

.projectlist {
  .row ();

  .project {
    // margin-bottom: 1rem;
    display: flex;
    border-top: 1px solid var(--bc);
    padding: 0;

    .info {
      width: @namesize;
      min-width: @namesize;
    }

    .data {
      flex: 1;
    }

    .name {
      // background: var(--fg);
      // color: var(--bg);
      // padding: 0.25em 1em;
      // border-radius: 0.25em;
      display: block;
      text-decoration: none;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      max-width: calc(100% - 1rem);
      line-height: 1.2;
    }

    .notes {
      // width: 34rem;
    }
  }
}

.categories {
  position: sticky;
  top: 0;
  background: var(--bg);
  .row();
  z-index: 9;
  margin-bottom: 1rem;
  padding-top: 0.5rem;

  .frame {
    width: calc(100% - @namesize);
    margin-left: @namesize;
    display: flex;
    gap: 2rem;
    background: var(--bg);

    .category {
      flex: 1;
      background: var(--bg);
      font-weight: 600;

      .params {
        display: flex;
        font-size: 0.6rem;
        gap: .5rem;

        .param {
          white-space: nowrap;
        }
      }
    }
  }
}

.data {
  display: flex;
  gap: 2rem;

  .category {
    // flex: 1;
  }

  .params {
    display: flex;
    gap: .5rem;

    .param {
      flex: 1;
      position: relative;
      cursor: pointer;
      overflow: visible;
      padding: 0.5rem 0;

      .param-name {
        position: absolute;
        font-size: 0.6rem;
        line-height: 1em;
        opacity: 0;
      }

      .circle-icon {
        width: 2rem;
        height: 2rem;

        :deep(svg) {
          width: 100% !important;
          height: 100% !important;
          display: block;
        }

        &.closed-icon {
          color: var(--g1);
        }

        &.partial-icon {
          color: var(--g2);
        }

        &.open-icon {
          color: var(--g3);
        }
      }

      .hover {
        position: absolute;
        top: 100%;
        left: 0;
        width: 20rem;
        opacity: 0;
        pointer-events: none;
        background: var(--bg);
        font-size: 0.75rem;
        padding: 0.75rem 1rem;
        box-shadow: 0 0 0.5rem var(--shadow);
        line-height: 1.4em;

        .param-hover-name {
          font-size: 0.6rem;
          font-weight: 800;
        }
      }

      &:hover {
        z-index: 9;

        .hover {
          opacity: 1;
          pointer-events: auto;
        }
      }
    }
  }
}

.param {
  width: 3rem;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>