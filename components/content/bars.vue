<template>
  <div class="bars" ref="el" :class="{ sticky: isvisible }">
    <div class="meta">
      <div class="models-info">
        <!-- {{ models.length }}/{{ models.length }} Generative AI Models -->
      </div>
      <NuxtLink target="_blank" to="https://github.com/Language-Technology-Assessment/main-database" class="source">
        <div>Version 14-04-2024</div>
        <Icon icon="iconamoon:link-external-fill"></Icon>
      </NuxtLink>
    </div>
    <div class="filters">
      <div class="select">
        Active filters
      </div>
      <div class="show-hide">
        Compare {{ store.selected.length }}
      </div>
    </div>
    <div class="search">
      <div class="searchbox" :class="{ searchFocus }">
        <input type="text" v-model="searchQuery" @focus="searchFocus = true" @blur="searchFocus = false"
          placeholder="Search...">
        <button class="icon">
          <Icon icon="iconamoon:search-bold"></Icon>
        </button>
        <button class="icon">
          <Icon icon="mage:filter-fill"></Icon>
        </button>
      </div>
    </div>
    <div class="models" :class="{ somethingisopen: open }">
      <div class="model" v-for="(item, k) in models"
        :class="{ active: store.selected.includes(item.filename), open: item === open }">
        <div class="compare">
          <button class="checkbox" @click.stop="store.toggle(item.filename)"
            :class="{ active: store.selected.includes(item.filename) }">
            <Icon icon="uil:check" v-if="store.selected.includes(item.filename)"></Icon>
            <Icon icon="mdi:plus" v-else></Icon>
          </button>
        </div>
        <div class="content" @click="router.push(`/model/${item.filename}`)" @mouseenter="open = item"
          @mouseleave="open = false; openParam = false">
          <div class="info">
            <div class="name">
              {{ item.project.name || '(undefined)' }}
            </div>
            <div class="org">
              by {{ item.org.name || '(undefined)' }}
            </div>
            <!-- <button class="checkbox" @click.stop="store.toggle(item.filename)"
            :class="{ active: store.selected.includes(item.filename) }">
            <Icon icon="mingcute:checkbox-fill" v-if="store.selected.includes(item.filename)"></Icon>
            <Icon icon="mdi:plus-box" v-else></Icon>
          </button> -->
          </div>
          <div class="score" :class="{ open: open === item }">
            <scorebar :score="item.score" :style="{ '--fg': color(item.score) }"></scorebar>
            <div class="subscore" v-if="open === item">
              <div class="params" @mouseleave="openParam = false">
                <div class="param" v-for="param in params" @mouseenter="openParam = param.ref">
                  <div class='circle-icon open-icon' v-if="item[param.ref].class === 'open'" v-html="openIcon"></div>
                  <div class='circle-icon closed-icon' v-if="item[param.ref].class === 'closed'" v-html="closedIcon">
                  </div>
                  <div class='circle-icon partial-icon' v-if="item[param.ref].class === 'partial'" v-html="partialIcon">
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import openIcon from '@/assets/icons/open.svg?raw'
import closedIcon from '@/assets/icons/closed.svg?raw'
import partialIcon from '@/assets/icons/partial.svg?raw'

import { useElementBounding } from '@vueuse/core'
import { Icon } from '@iconify/vue'
const open = ref()
const openParam = ref()
const el = ref(null)
const { y } = useElementBounding(el)
const isvisible = computed(() => y.value < 0)
const router = useRouter();
const { models: originalModels, color, params, categories } = useModels()

const models = computed(() => {
  if (searchQuery.value.length > 0) {
    return originalModels.value.filter(x => {
      if (!x.project?.name || !x.org?.name) return false
      const regex = new RegExp(searchQuery.value, 'i')
      return x.project.name.match(regex) || x.org.name.match(regex)
    })
  }
  // if (filters.value) {}
  return originalModels.value
})

const searchQuery = ref('')
const searchFocus = ref(false)
const store = useMyComparisonStore()
function getCatName() {
  const catref = params.find(x => x.ref === openParam.value).category
  return categories.find(x => x.ref === catref).name
}
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
}

.meta {
  position: sticky;
  top: 0;
  background: var(--bc);
  left: 0;
  width: 100%;
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  padding: 0.5em 1em;
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

.filters {
  display: flex;
  gap: 2rem;
  color: var(--fg2);
  padding: 2rem 4rem 0;
  font-size: 0.75rem;

  display: none;

  >div {
    background: var(--bc);
    flex: 1;
    padding: 0.75em 1em;
    border-radius: 0.25rem;
  }
}

.search {
  padding: 3rem 4rem 0;

  .searchbox {
    display: flex;
    border: 1px solid var(--bc);
    border-radius: 0.25rem;
    overflow: hidden;

    &.searchFocus {
      background: var(--bg3);
    }

    input {
      flex: 1;
      font-weight: inherit;
      border-radius: 0;

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
      padding: 0 1rem 0 0;
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
  padding: 0.5em 0 1.5rem;
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
        background: var(--bg3);
        color: var(--fg2);
      }

      &.active {
        background: var(--fg2);
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
        text-decoration: underline;
      }
    }
  }
}

.subscore {
  position: absolute;
  top: 0;
  // top: 1.25rem;
  z-index: 2;
  width: 100%;
  border-radius: 0.5rem;
  height: 1.5rem;
  display: flex;
  animation: subscorein .4s @easeInOutExpo 0s 1 forwards;
  opacity: 0;

  @keyframes subscorein {
    to {
      opacity: 1;
    }
  }

  .params {
    display: flex;
    flex: 1;
    padding: 0;
    overflow: hidden;
    border-radius: 0.25rem;
    background: var(--bg3);

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
    position: absolute;
    top: calc(1.5rem + 1px);
    left: 0;
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
    padding: 2rem 1rem;

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