<template>
  <div class="bars">
    <div class="filters">
      <!-- <div class="group">
        <button>High to low</button>
        <button>Low to high</button>
      </div> -->
      <Div class="group">
        Showing {{ models.length }} of {{ models.length }} AI models
      </Div>
      <div class="group">
        <button>+ Add a custom filter</button>
      </div>
      <!-- <div class="cats group">
        <label>Required:</label>
        <div class="cat" v-for="cat in categories">
          <div class="cat-name">{{ cat.name }}</div>
          <div class="params">
            <div class="param" v-for="param in cat.params">
              {{ param.name }}
            </div>
          </div>
        </div>
      </div> -->
    </div>
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
import { Icon } from '@iconify/vue'
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
  display: flex;
  gap: 4rem;
}

label {
  margin-bottom: 2rem;
}

.filters {
  width: 30%;
  flex-shrink: 0;
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  background: var(--bg2);
  padding: 2rem;
  align-self: flex-start;
  border-radius: 0.25rem;

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
  .row();
  margin: 0 auto;
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
</style>