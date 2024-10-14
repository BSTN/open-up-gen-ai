<template>
  <div class="bars" ref="el" :class="{ sticky: isvisible }">
    <!-- filter screen -->
    <FilterScreen v-model:open="filterscreenOpen" v-model:filters="filters" v-model:models="models">
    </FilterScreen>
    <!-- content -->
    <div class="search">
      <div class="searchbox" :class="{ searchFocus }">
        <button class="icon search">
          <Icon icon="iconamoon:search-bold"></Icon>
        </button>
        <input type="text" v-model="searchQuery" @focus="searchFocus = true" @blur="searchFocus = false"
          placeholder="Filter...">
        <button class="icon" @click="filterscreenOpen = true">
          <Icon icon="mage:filter-fill"></Icon>
        </button>
      </div>
    </div>
    <div class="meta">
      <div class="models-info">
        Showing {{ models.length }}/{{ originalModels.length }} models
      </div>
      <NuxtLink target="_blank" to="https://github.com/Language-Technology-Assessment/main-database" class="source">
        <div>Version 14-04-2024</div>
        <Icon icon="iconamoon:link-external-fill"></Icon>
      </NuxtLink>
    </div>
    <div class="models" :class="{ somethingisopen: !!open }">
      <div class="model" v-for="(item, k) in models" :key="item.filename"
        :class="{ active: store.selected.includes(item.filename), open: !!open && item.filename === open.filename }">
        <!-- <div class="compare">
          <button class="checkbox" @click.stop="store.toggle(item.filename)"
            :class="{ active: store.selected.includes(item.filename) }">
            <Icon icon="uil:check" v-if="store.selected.includes(item.filename)"></Icon>
            <Icon icon="mdi:plus" v-else></Icon>
          </button>
        </div> -->
        <div class="content" @click="router.push(`/model/${item.filename}`)" @mouseenter="open = item"
          @mouseleave="open = false; openParam = false">
          <div class="info">
            <div class="name">
              {{ item.project.name || '(undefined)' }}
            </div>
            <div class="org">
              by {{ item.org.name || '(undefined)' }}
            </div>
            <button class="checkbox" @click.stop="store.toggle(item.filename)"
              :class="{ active: store.selected.includes(item.filename) }">
              <div>Compare</div>
              <Icon icon="uil:check" v-if="store.selected.includes(item.filename)"></Icon>
              <!-- <Icon icon="mdi:plus" v-else></Icon> -->
              <Icon icon="basil:plus-outline" v-else></Icon>
            </button>
          </div>
          <div class="score" :class="{ open: !!open && open.filename === item.filename }">
            <scorebar :score="item.score" :style="{ '--fg': color(item.score) }"></scorebar>
            <div class="subscore" v-if="!!open && open.filename === item.filename" @mouseleave="openParam = false">
              <div class="params">
                <div class="param" v-for="param in params" @mouseenter="openParam = param.ref">
                  <div class='circle-icon open-icon' v-if="item[param.ref].class === 'open'" v-html="openIcon"></div>
                  <div class='circle-icon closed-icon' v-if="item[param.ref].class === 'closed'" v-html="closedIcon">
                  </div>
                  <div class='circle-icon partial-icon' v-if="item[param.ref].class === 'partial'" v-html="partialIcon">
                  </div>
                </div>
              </div>
              <div class="param-info" v-if="openParam">
                <div class="name">
                  <div class="cat-name">{{ getCatName() }}:</div>
                  <div class="param-name">{{ params.find(x => x.ref === openParam).name }}</div>
                </div>
                <div class="param-notes" v-if="item[openParam].notes">{{ item[openParam].notes }}</div>
                <div class="param-notes" v-else>(undefined)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- compare -->
    <div class="stickycompare" v-if="store.selected.length > 0">
      <Icon icon="heroicons:arrow-top-right-on-square-20-solid" @click="openComparison()"></Icon>
      <div class="txt" @click="openComparison()">
        Compare {{ store.selected.length }} models
      </div>
      <Icon class="clear" icon="ic:round-close" @click.stop="clearSelection()"></Icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import openIcon from '@/assets/icons/open.svg?raw'
import closedIcon from '@/assets/icons/closed.svg?raw'
import partialIcon from '@/assets/icons/partial.svg?raw'
import cloneDeep from 'lodash/cloneDeep'

import { useElementBounding } from '@vueuse/core'
import { Icon } from '@iconify/vue'
const props = defineProps(['filters', 'version'])
const open = ref()
const openParam = ref()
const el = ref(null)
const { y } = useElementBounding(el)
const isvisible = computed(() => y.value < 0)
const router = useRouter();
const filters = ref({})
const filterscreenOpen = ref(false)
const { models: originalModels, color, params, categories } = useModels()

const models = computed(() => {
  const llms = cloneDeep(originalModels.value)
  const ffs = cloneDeep(filters.value)
  if (searchQuery.value.length > 0 || (filters.value && Object.keys(filters.value).length > 0)) {
    return llms.filter(x => {

      // filter with searchquery
      if (searchQuery.value.length > 0) {
        const regex = new RegExp(searchQuery.value, 'i')
        if (!x.project?.name || !x.org?.name) return false
        if (!(x.project.name.match(regex) || x.org.name.match(regex))) {
          return false
        }
      }

      // filter with filters
      if (ffs && Object.keys(ffs).length > 0) {

        // check if model is in models list
        if (ffs.models && ffs.models.length > 0 && searchQuery.value.length < 1) {
          if (!ffs.models.includes(x.filename)) {
            return false
          }
        }

        // check if param value is value
        for (let paramname in ffs) {
          if (paramname in x && 'class' in x[paramname] && paramname !== 'models') {
            if (x[paramname].class === 'closed' && !ffs[paramname].includes(0)) return false
            if (x[paramname].class === 'open' && !ffs[paramname].includes(1)) return false
            if (x[paramname].class === 'partial' && !ffs[paramname].includes(0.5)) return false
          }
        }
      }
      return true
    })
  }
  return llms
})

const searchQuery = ref('')
const searchFocus = ref(false)
const store = useMyComparisonStore()
function getCatName() {
  const catref = params.find(x => x.ref === openParam.value).category
  return categories.find(x => x.ref === catref).name
}

function openComparison() {
  router.push(`/compare?models=${store.selected.join(',')}`)
}
function clearSelection() {
  const sure = confirm('Are you sure you want to clear the selected models?')
  if (sure) {
    store.selected = []
  }
}

onMounted(() => {
  if (props.filters) {
    filters.value = props.filters
  }
})
</script>

<style lang="less" scoped>
.bars {
  .row();
  // display: flex;
  // gap: 4rem;
  width: 50rem;
  border: 1px solid var(--bc);
  padding: 0rem;
  border-radius: 0.25rem;
  position: relative;
  margin-bottom: 4rem;
}

.meta {
  position: sticky;
  top: 0;
  background: var(--bc);
  left: 0;
  width: 100%;
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  padding: 0.5em 1rem;
  line-height: 1;
  color: var(--fg2);
  display: flex;
  gap: 1em;
  z-index: 9;
  align-items: center;

  .models-info {
    flex: 1;
  }

  .source {
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 1em;

    :deep(svg) {
      flex-shrink: 0;
    }
  }

  @media (min-width: 50rem) {
    .nottop.scroll-up & {
      transition-delay: 0.15s;
      top: 3.2rem;
    }
  }

}

.search {
  background: var(--bc);
  padding: .5rem .5rem 0;

  .searchbox {
    display: flex;
    border: 1px solid var(--bc);
    border-radius: 0.25rem;
    overflow: hidden;
    background: var(--bg2);
    font-size: 0.75rem;
    padding: 0 0.75rem;

    &.searchFocus {
      background: var(--bg3);
    }

    input {
      flex: 1;
      font-weight: inherit;
      border-radius: 0;
      background: var(--bg2);
      padding: 0.5rem 0.5rem 0.5rem 0.5rem;

      &:focus {
        background: var(--bg3);
      }
    }

    >.icon {
      font-size: 1rem;
      display: flex;
      align-items: center;
      padding: 0;
      line-height: 0;
      padding: 0;
      margin: 0;
      border-radius: 0;
      // border-left: 1px solid var(--bc);
      color: var(--fg2);
      background: transparent;

      &:hover {
        background: transparent;
        color: var(--fg);
      }
    }
  }
}

.models {
  margin: 0 auto;
  padding: 2rem 4rem;
}

.model {
  padding: 0.5em 0 2rem;
  margin-bottom: 1px;
  text-decoration: none;
  align-items: center;
  user-select: none;

  display: flex;
  align-items: flex-start;
  gap: 1rem;

  .models.somethingisopen & {
    opacity: 0.3;
    transition: all ease 1s;
  }

  &.open {
    opacity: 1 !important;
  }


  .compare {
    font-size: 1.5rem;

    .checkbox {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 100%;
      background: var(--bg3);
      color: var(--bg2);
      padding: 0;
      margin-right: 0.5rem;
      line-height: 0;
      font-size: 1.25rem;
      transform: translateY(0.125rem);
      opacity: 1;
      transition: all 0.2s ease;

      &:hover {
        background: var(--fg2);
        color: var(--bg3);
      }

      &.active {
        background: var(--fg);
        color: var(--bg3);

        &:hover {
          background: var(--fg);
          color: var(--bg3);
        }
      }
    }
  }

  .content {
    flex: 1;
  }

  .info {
    display: flex;
    margin-bottom: .5rem;
    align-items: center;

    .name {
      margin-right: .5rem;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    .org {
      // font-size: 0.75rem;
      color: var(--fg2);
      flex: 1;
    }

    .name,
    .org {
      a {
        opacity: 0;
        margin-left: 0.5rem;
        line-height: 1;
        padding: 0;
        transition: 0.2s ease;
      }
    }

    .checkbox {
      color: var(--fg2);
      padding: 0.25rem 0.25rem 0.25rem 0.75rem;
      font-size: 0.75rem;
      opacity: 0;
      background: transparent;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      line-height: 1;

      div {
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.75em;
        opacity: 0;
        transform: translateX(1em);
        transition: all 0.5s @easeInOutExpo;
      }

      :deep(svg) {
        width: 1.25rem !important;
        height: 1.25rem !important;
        background: var(--bg3);
        border-radius: 0.25rem;
      }

      &.active {
        color: var(--fg2);
        opacity: 1;

        :deep(svg) {
          color: var(--bg3);
          background: var(--fg);
        }
      }


    }

  }


  .score {
    position: relative;
    flex: 1;
    text-align: left;
    --fg: var(--listfg);
    --bg: var(--bg3);

    &:after {
      content: "";
      position: absolute;
      top: 100%;
      height: 0.5rem;
      width: 100%;
    }

    :deep(.scorebar) {
      width: 100%;
      --sb-height: 1rem;
    }

    &.open {
      :deep(.scorebar) {
        opacity: 1;
      }
    }
  }

  .content:hover {
    cursor: pointer;

    .info {
      .name {
        // text-decoration: underline;
      }

      .checkbox {
        opacity: 1;

        div {
          opacity: 1;
          transform: translateX(0);
        }
      }
    }
  }
}

.subscore {
  position: absolute;
  top: 0;
  // top: 1.5rem;
  z-index: 2;
  width: 100%;
  border-radius: 0.5rem;
  // display: flex;
  animation: subscorein .4s @easeInOutExpo 0s 1 forwards;
  opacity: 0;

  @keyframes subscorein {
    to {
      opacity: 1;
    }
  }

  .params {
    height: 1.5rem;
    display: flex;
    flex: 1;
    padding: 0;
    overflow: hidden;
    border-radius: 0.25rem;
    background: var(--bg3);
    margin-bottom: 1px;

    &:hover {
      border-radius: 0.25rem 0.25rem 0 0;

      .param {
        .circle-icon {
          opacity: 0.25;
        }
      }
    }
  }

  .param {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: paramin .4s @easeInOutExpo 0s 1 forwards;
    opacity: 0;
    border-left: 1px solid var(--bg2);
    background: var(--bg3);

    &:first-child {
      border-left: 0;
    }

    transform: translateY(-2rem);

    @keyframes paramin {
      100% {
        opacity: 1;
        transform: translateX(0rem);
      }
    }

    &:hover {
      .circle-icon {
        opacity: 1 !important;
      }
    }

    .circle-icon {
      width: 1rem !important;
      height: 1rem !important;
      display: inline-block;
      padding: 0;
      margin: 0;

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
  }

  .param-info {
    position: relative;
    // top: calc(1.5rem + 1px);
    // left: 0;
    padding: 1rem 1.5rem 2rem;
    background: var(--bg3);
    border-radius: 0 0 0.25rem 0.25rem;
    font-size: 0.75rem;
    width: 100%;

    .name {
      font-weight: 600;

      >div {
        display: inline;
        margin-right: 0.5rem;
      }

      .param-name {}
    }

    .param-notes {
      color: var(--fg2);
      max-width: 30em;
    }
  }
}

each(range(1, 30, 1), {
  .param:nth-child(@{value}) {
    animation-delay: @value * 0.02s;
  }
});

div.stickycompare {
  position: sticky;
  bottom: 0;
  // left: 0;
  margin: 0;
  padding: .75rem 1rem;
  // font-size: 0.75rem;
  background: var(--bc);
  color: var(--fg2);
  border-radius: 0;
  display: flex;
  gap: 1rem;
  z-index: 99;
  width: 100%;
  align-items: center;

  :deep(svg) {
    font-size: 1.25rem;
    margin: 0;
    cursor: pointer;

    &:hover {
      color: var(--fg);
    }
  }


  @media(max-width: 50rem) {}

  div {
    flex: 1;
    cursor: pointer;

    &:hover {
      color: var(--fg);
      text-decoration: underline;
    }
  }

  button {
    background: var(--bg2);
    color: var(--fg2);
    padding: 0.25rem 0.75rem;
    margin: 0;
  }
}


@media (max-width: 40rem) {
  .bars {
    width: 100%;
    max-width: 100%;
    border-right: 0;
    border-left: 0;
  }

  .search {
    padding: 1rem;
  }

  .models {
    padding: 2rem;

    .model {
      margin-bottom: 1rem;

      .info {
        position: relative;
        display: block;

        .checkbox {
          position: absolute;
          top: 0;
          right: 0;
        }
      }

    }
  }
}

@media (max-width: 30rem) {
  .bars {
    max-width: 100%;
    border: 0;
  }

  .models {
    padding: 2rem;
  }
}
</style>