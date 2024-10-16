<template>
  <div class="the-index" ref="el" :class="{ sticky: isvisible, filtershidden: props.hideFilters }">
    <!-- filter screen -->
    <FilterScreen v-model:open="filterscreenOpen" v-model:filters="filters" v-model:models="models"
      :originalModels="originalModels" :categories="categories">
    </FilterScreen>
    <!-- metadata -->
    <div class="meta">
      <div></div>
      <NuxtLink target="_blank" :to="url" class="source" v-if="!loading">
        <div><span class='not-latest' v-if="props.version && props.version !== latestInfo.hash">⚠️</span> {{ date }}
        </div>
        <Icon icon="iconamoon:link-external-fill"></Icon>
      </NuxtLink>
      <!-- <div class="models-info">
          Showing {{ models.length }}/{{ originalModels.length }} models
        </div> -->
    </div>
    <!-- context -->
    <div class="context" v-if="!props.hideFilters">
      <!-- search box -->
      <div class="search">
        <div class="searchbox" :class="{ searchFocus }">
          <button class="icon searchicon">
            <Icon icon="iconamoon:search-bold"></Icon>
          </button>
          <input type="text" v-model="searchQuery" @focus="searchFocus = true" @blur="searchFocus = false"
            placeholder="Search...">
          <!-- <div class="models-count">
            {{ models.length }}/{{ originalModels.length }}
          </div> -->

          <!-- <button class="icon" @click="filterscreenOpen = true">
            <Icon icon="mage:filter-fill"></Icon>
          </button> -->
        </div>
      </div>
      <div class="filter-by">
        <!-- <label>Type:</label> -->
        <div class="types multibutton">
          <button class="filterbutton">Text</button>
          <button class="filterbutton">Image</button>
          <button class="filterbutton">Video</button>
          <button class="filterbutton">Sound</button>
        </div>
      </div>
      <!-- <div class="filter-by">
        <label>Active models:</label>
        <button class="filterbutton">No filter active...</button>
      </div> -->
      <div class="filter-by">
        <button class="filterbutton editable" @click="filterscreenOpen = true">
          <span>Active filters ({{ filters ? Object.keys(filters).length : ''
            }})</span>
          <Icon icon="mage:filter-fill"></Icon>
        </button>
      </div>
    </div>

    <!-- content -->
    <div class="content">
      <Icon icon="eos-icons:three-dots-loading" v-if="loading"></Icon>
      <div class="models" :class="{ somethingisopen: !!open }" v-if="models && models.length > 0">
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
              <div class="org">
                {{ item.org.name || '(undefined)' }}
              </div>
              <div class="name">
                {{ item.project.name || '(undefined)' }}
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
                    <div class='circle-icon open-icon' v-if="item[param.ref].class === 'open'" v-html="openIcon">
                    </div>
                    <div class='circle-icon closed-icon' v-if="item[param.ref].class === 'closed'" v-html="closedIcon">
                    </div>
                    <div class='circle-icon partial-icon' v-if="item[param.ref].class === 'partial'"
                      v-html="partialIcon">
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
      <div class="no-models" v-if="!loading && models && models.length < 1">
        No models or organisations match your filters.
      </div>
    </div>
    <!-- compare -->
    <div class="filter-by compare-filter" v-if="store.selected.length > 0">
      <div class="stickycompare">
        <!-- <Icon class="checkbox" icon="uil:check" @click="openComparison()"></Icon> -->
        <!-- <Icon icon="heroicons:arrow-top-right-on-square-20-solid" @click="openComparison()"></Icon> -->
        <div class="txt" @click="openComparison()">
          Compare selected model{{ store.selected.length > 1 ? 's' : '' }} ({{ store.selected.length }})
        </div>
        <Icon class="clear" icon="ic:round-close" @click.stop="clearSelection()"></Icon>
      </div>
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
const props = defineProps(['filters', 'version', 'hideFilters'])
const open = ref()
const openParam = ref()
const el = ref(null)
const { y } = useElementBounding(el)
const isvisible = computed(() => y.value < 0)
const router = useRouter();
const filters = ref({})
const filterscreenOpen = ref(false)

const { loading, date, url, error, models: originalModels, color, params, categories, latestInfo } = useModels(props.version)

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
<style lang="less">
p+.the-index {
  margin-top: 4rem !important;
}
</style>
<style lang="less" scoped>
.the-index {
  .row();
  // display: flex;
  border-radius: 0.5rem;
  // border: 1px solid var(--bc);
  padding: 0rem;
  position: relative;
  margin-bottom: 4rem;
  background: var(--bg2);
  align-items: flex-start;
  gap: 4rem;
  width: 50rem;

  &.filtershidden {
    width: 50rem;
  }

  >.context {
    flex: 1;
    padding: 0;
    position: sticky;
    top: 0;
    transition: all 0.3s ease;

    display: flex;
    gap: 1rem;
    padding: 1rem 3rem 1rem;
    background: var(--bg2);
    z-index: 9;
    // border-bottom: 1px solid var(--bg3);
    margin-bottom: 2rem;
    // background: var(--bg3);
    border-radius: 0.5rem 0.5rem 0 0;
    // background: color-mix(in srgb, var(--bg3) 50%, transparent);

    .nottop & {
      border-bottom: 1px solid var(--bg3);
    }

    >div {
      flex: 1;
    }

    .search {
      width: 16rem;
    }

    .nottop.scroll-up & {
      top: 3.2rem;
    }
  }

  >.content {
    flex: 1;
  }

  @media (max-width: 50rem) {
    display: block;

    >.context {
      margin-bottom: 4rem;
      width: 100%;
      max-width: none;
      position: relative;
    }
  }
}

.meta {
  // background: color-mix(in srgb, var(--bg3) 50%, transparent);
  // border-bottom: 1px solid var(--bg);
  left: 0;
  width: 100%;
  padding: 0 0;
  color: var(--fg2);
  gap: 1em;
  font-size: 0.65rem;
  z-index: 9;
  align-items: center;
  // position: absolute;
  // top: 0;
  display: flex;
  border-radius: 0.5rem 0.5rem 0 0;
  z-index: 10;
  margin-bottom: 1rem;

  >div {
    flex: 1;
  }

  >* {
    padding: 0.25rem .5rem;
    opacity: 0.5;
  }

  &:hover {
    opacity: 1;

    >* {
      opacity: 1;
    }
  }

  .source {
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    text-align: right;
    gap: 1em;

    :deep(svg) {
      flex-shrink: 0;
    }
  }

}

.search {
  padding: 0;

  .searchbox {
    width: 100%;
    display: flex;
    border: 1px solid var(--bg3);
    border-radius: 0.25rem;
    overflow: hidden;
    background: var(--bg2);
    padding: 0 0.75rem 0 0.5rem;
    align-items: center;
    gap: 0.25rem;

    .models-count {
      font-size: 0.75rem;
      color: var(--fg2);
      opacity: 0.5;
    }

    &.searchFocus {
      background: var(--bg3);
      border: 1px solid var(--bg3);
    }

    input {
      flex: 1;
      font-weight: inherit;
      border-radius: 0;
      background: transparent;
      padding: 0.5rem 0.5rem 0.5rem 0.5rem;
      font-size: 0.75rem;
      line-height: 1.4;
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

    &:hover {
      background: var(--bg3);

      &.searchFocus {
        background: var(--bg3);
      }
    }
  }
}

.filter-by {
  padding: 0;
  display: flex;
  gap: 1rem;
  align-items: center;

  label {
    font-size: 0.75rem;
    color: var(--fg2);
    opacity: 0.5;
    padding: 0;
    margin: 0;
  }

  .types {
    gap: .5rem;
    display: flex;
    flex-direction: row;

    button {
      line-height: 1.4;
    }

    &.multibutton {
      gap: 0;
      border: 1px solid var(--bg3);
      border-radius: 0.25rem;
      overflow: hidden;

      >button.filterbutton {
        border: 0;
        border-left: 1px solid var(--bg3);
        border-radius: 0;

        &:first-child {
          border-left: 0;
          background: var(--bg3);
          color: var(--fg);
        }
      }
    }
  }
}

button.filterbutton {
  flex: 1;
  line-height: 1.4;
  text-align: left;
  padding: 0.5rem 0.75rem;
  margin: 0;
  font-size: 0.75rem;
  color: var(--fg2);
  border-radius: 0.25rem;
  border: 1px solid var(--bg3);
  background: transparent;
  display: block;
  width: 100%;

  &.editable {
    display: flex;

    span {
      flex: 1;
      align-items: center;
    }

    :deep(svg) {
      line-height: 1;
      margin: 0;
    }
  }

  // background: var(--bg);
  &:hover {
    color: var(--link);
    background: var(--bg2);
  }
}

.no-models {
  padding: 1rem 3rem 3rem;
  color: var(--fg2);
  text-align: center;
}

.models {
  margin: 0 auto;
  padding: 0 3rem;
  flex: 1;
}

.model {
  padding: 0em 0 2.5rem;
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
      flex: 1;
      color: var(--fg2);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &:hover {
        text-decoration: underline;
      }
    }

    .org {
      // font-size: 0.75rem;
      margin-right: 0.5rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
      margin-bottom: 0.25em;

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

.compare-filter {
  position: sticky;
  bottom: 0;
  background: var(--bg3);
  border-radius: 0 0 0.5rem 0.5rem;
}

div.stickycompare {
  position: sticky;
  bottom: 0;
  // left: 0;
  margin: 0;
  padding: 1rem 2rem 1rem;
  // font-size: 0.75rem;
  background: transparent;
  border-top: 1px solid var(--bg3);
  color: var(--fg2);
  display: flex;
  gap: 1rem;
  z-index: 99;
  width: 100%;
  align-items: center;
  border-radius: 0.25rem;
  cursor: pointer;

  :deep(svg) {
    font-size: 1.25rem;
    margin: 0;
    cursor: pointer;

    &:hover {
      color: var(--fg);
    }

    &.checkbox {
      background: var(--fg);
      color: var(--bg3);
      border-radius: 0.25rem;
    }
  }

  div {
    flex: 1;
    cursor: pointer;

    &:hover {
      color: var(--link);
      text-decoration: underline;
    }
  }

  button {
    background: var(--bg2);
    color: var(--fg2);
    padding: 0.25rem 0.75rem;
    margin: 0;
  }

  &:hover {
    color: var(--link);

    .clear {
      color: var(--fg2);

      &:hover {
        color: var(--link);
      }
    }

    div {
      text-decoration: underline;
    }
  }
}


@media (max-width: 40rem) {
  .the-index {
    width: 100%;
    max-width: 100%;
    border-right: 0;
    border-left: 0;
  }

  .models {

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
  .the-index {
    max-width: 100%;
    border: 0;
  }

}
</style>