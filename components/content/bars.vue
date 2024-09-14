<template>
  <div class="bars" ref="el" :class="{ sticky: isvisible }">
    <div class="meta">
      <div class="models-info">{{ models.length }}/{{ models.length }} Generative AI Models</div>
      <NuxtLink target="_blank" to="https://github.com/Language-Technology-Assessment/main-database" class="source">
        <div>Version 14-04-2024</div>
        <Icon icon="iconamoon:link-external-fill"></Icon>
      </NuxtLink>
    </div>
    <!-- <div class="filters">
      <div class="group">
        <button>+ Add a custom filter</button>
      </div>
      <div class="cats group">
        <label>Required:</label>
        <div class="cat" v-for="cat in categories">
          <div class="cat-name">{{ cat.name }}</div>
          <div class="params">
            <div class="param" v-for="param in cat.params">
              {{ param.name }}
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="models">
      <div class="model" v-for="(item, k) in models" :class="{ active: store.selected.includes(item.filename) }"
        @click="router.push(`/model/${item.filename}`)">
        <div class="info">
          <div class="name">
            {{ item.project.name || '(undefined)' }}
          </div>
          <div class="org">
            by {{ item.org.name || '(undefined)' }}
          </div>
          <button class="checkbox" @click.stop="store.toggle(item.filename)"
            :class="{ active: store.selected.includes(item.filename) }">
            <Icon icon="mingcute:checkbox-fill" v-if="store.selected.includes(item.filename)"></Icon>
            <Icon icon="mdi:plus-box" v-else></Icon>
          </button>
        </div>
        <div class="score">
          <scorebar :score="item.score" :style="{ '--fg': color(item.score) }"></scorebar>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useElementBounding } from '@vueuse/core'
import { Icon } from '@iconify/vue'
const el = ref(null)
const { y } = useElementBounding(el)
const isvisible = computed(() => y.value < 0)
const router = useRouter();
const { models, color, categories } = useModels()
const store = useMyComparisonStore()
const folded = ref<Array<string>>([])
function toggleFold(filename: string) {
  if (folded.value.includes(filename)) {
    folded.value.splice(folded.value.indexOf(filename), 1)
  } else {
    folded.value.push(filename)
  }
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

  .nottop.scroll-up & {
    transition-delay: 0.15s;
    top: 3.2rem;
  }

}

label {
  margin-bottom: 2rem;
}

.filters {
  // width: 30%;
  flex-shrink: 0;
  position: sticky;
  top: 0rem;
  max-height: calc(100vh - 4rem);
  background: var(--bg2);
  padding: 2rem;
  align-self: flex-start;
  border-radius: 0.25rem;
  z-index: 9;
  margin-bottom: 2rem;

  .group {
    margin-bottom: 1rem;

    label {
      flex: 1;
      margin-bottom: 0.5rem;
    }
  }

  button {
    background: var(--bg);
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
  }

  .cats {

    .cat {
      margin-bottom: 1rem;

      .cat-name {
        // text-decoration: underline;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .params {
        .param {
          // display: inline-block;
          background: var(--bg2);
          border-radius: 0.25rem;
          padding: 0.15rem 0.5rem;
          margin: 0 0.25rem 0.25rem 0;
          font-size: 0.75rem;
          // color: var(--fg2);
        }
      }
    }
  }
}

.models {
  margin: 0 auto;
  padding: 3rem 4rem;
}

.model {
  padding: 0.5em 0 1rem;
  margin-bottom: 1px;
  text-decoration: none;
  align-items: center;
  user-select: none;

  .info {
    display: flex;
    margin-bottom: .5rem;
    align-items: center;

    .checkbox {
      color: var(--fg2);
      padding: 0;
      margin-right: 0.5rem;
      line-height: 0;
      font-size: 1.5rem;
      transform: translateY(0.125rem);
      opacity: 0;
      transition: all 0.2s ease;

      &:hover {
        background: transparent;
        color: var(--fg2);
      }

      &.active {
        color: var(--fg);
        opacity: 1;
      }
    }

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

    &:hover {
      .checkbox {
        opacity: 1;
      }
    }

  }


  .score {
    flex: 1;
    text-align: left;
    --fg: var(--listfg);
    --bg: var(--bg3);

    :deep(.scorebar) {
      width: 100%;
      --sb-height: 1rem;
    }
  }

  &:hover {
    cursor: pointer;

    .info {
      .name {
        text-decoration: underline;
      }
    }
  }
}

@media (max-width: 40rem) {
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