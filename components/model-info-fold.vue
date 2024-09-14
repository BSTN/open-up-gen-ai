<template>
  <div class="model-info" @click.stop>
    <div class="frame" v-if="model">
      <div class="info">
        <div class="sub">
          <label>About the model:</label>
          <div class="notes" v-if="model.project.notes">{{ model.project.notes }}</div>
          <div class="notes" v-else>(Not available)</div>
          <label>Link to the model:</label>
          <NuxtLink :to="model.project.link">
            <Icon icon="iconamoon:link-external-fill"></Icon> {{ model.project.link }}
          </NuxtLink>
        </div>
        <div class="sub">
          <label>About the organisation:</label>
          <div class="notes" v-if="model.org.notes">{{ model.org.notes }}</div>
          <div class="notes" v-else>(Not available)</div>
          <label>Link to the organisation:</label>
          <NuxtLink :to="model.org.link">
            <Icon icon="iconamoon:link-external-fill"></Icon> {{ model.org.link }}
          </NuxtLink>
        </div>
        <div class="sub">
          <label>LLM Base:</label>
          <div class="notes">{{ model.project.llmbase || '(undefined)' }}</div>
          <label>RL Base:</label>
          <div class="notes">{{ model.project.rlbase || '(undefined)' }}</div>
        </div>
      </div>
      <div class="categories">
        <div class="category" v-for="category in categories">
          <div class="category-bar">
            <div class="category-name">{{ category.name }}</div>
            <!-- <div class="category-score" :style="bg(model.categories[category.ref])">{{
              model.categories[category.ref].toFixed(2)
            }}</div> -->
            <scorebar :score="model.categories[category.ref]"
              :style="{ '--fg': color(model.categories[category.ref]) }">
            </scorebar>
          </div>
          <div class="params">
            <div class="param" v-for="param in category.params">
              <div class="icon-frame">
                <div class='circle-icon open-icon' v-if="model[param.ref].class === 'open'" v-html="openIcon"></div>
                <div class='circle-icon closed-icon' v-if="model[param.ref].class === 'closed'" v-html="closedIcon">
                </div>
                <div class='circle-icon partial-icon' v-if="model[param.ref].class === 'partial'" v-html="partialIcon">
                </div>
              </div>
              <div class="param-info">
                <div class="param-name">{{ param.name }} <Icon icon="mage:tag-question-mark-fill"></Icon>
                </div>
                <div class='notes' v-html="model[param.ref].notes">
                </div>
                <NuxtLink :to="model[param.ref].link">{{ model[param.ref].link }}</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import openIcon from '@/assets/icons/open.svg?raw'
import closedIcon from '@/assets/icons/closed.svg?raw'
import partialIcon from '@/assets/icons/partial.svg?raw'

const { filename } = defineProps(['filename'])

const { models, categories, bg, color } = useModels()

const model = computed(() => {
  if (!filename) return false
  return models.value.find(x => x.filename === filename)
})
</script>

<style lang="less" scoped>
.model-info {
  .frame {}
}

.info {
  text-align: left;
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  // background: var(--bc);
  margin-bottom: 2rem;

  .sub {
    padding: 1.5rem 2rem 1.5rem 2rem;
    flex: 1;
    border: 1px solid var(--bc);
    border-radius: 0.25rem;
    color: var(--fg2);

    label {
      color: var(--fg);
    }

    a {
      text-decoration: none;

      &:hover {
        color: var(--link);
      }

      :deep(svg) {
        margin-right: .25rem;
      }
    }
  }

  h1,
  h2 {
    text-align: left;
    margin: 0 0 .5rem;
    max-width: 100%;
    line-height: 1.1;
  }

  .notes {
    margin-bottom: 1rem;
    line-height: 1.4;
    max-width: 32em;
  }

  .score {
    font-size: 2rem;
    font-weight: 600;
    text-align: right;
  }
}

.categories {
  display: flex;
  // border-top: 1px solid var(--bc);
  // border-bottom: 1px solid var(--bc);
  gap: 1rem;


  .category {
    flex: 1;
    // border-left: 1px solid var(--bc);
    padding-top: 1rem;
    padding-bottom: 2rem;
    flex-shrink: 0;
    flex-grow: 1;
    width: calc(100%/3);
    background: var(--bg2);
    border-radius: 0.25rem;

    .category-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 2rem;
      gap: .25rem;
      padding: 2rem 1rem 1rem;
      border-radius: 0.25rem;
      font-size: 1.25rem;
      line-height: 1.4;
      position: relative;

      .category-name {
        padding: 0;
        flex: 1;
        text-align: center;
        margin-bottom: .5rem;
        font-weight: 600;
      }

      .category-score {
        text-align: right;
        flex-shrink: 0;
        color: var(--bg);
        padding: 0 0.25rem;
        border-radius: 0.25rem;
        font-size: .75rem;
        position: absolute;
        top: 0;
        right: 1rem;
      }

      :deep(.scorebar) {
        --bg: var(--bg3);
        --sb-height: 0.35rem;
      }
    }
  }

  h2 {
    margin: 0;
  }


  .param {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    padding-right: 2rem;
    padding-left: 1rem;

    .param-info {
      &:hover {
        .param-name {
          :deep(svg) {
            opacity: 1;
          }
        }
      }
    }

    .icon-frame {
      width: 2rem;
      text-align: left;
      padding-left: 1rem;
      flex-shrink: 0;
      flex-grow: 0;

      .circle-icon {
        flex-shrink: 0;
        display: inline-block;
      }
    }

    .param-name {
      font-weight: 600;
      margin-bottom: 0.5rem;

      :deep(svg) {
        transition: 0.2s ease;
        color: var(--fg2);
        opacity: 0;
      }
    }

    .notes {
      color: var(--fg2);
      // width: 32em;
      max-width: 100%;
      font-size: 0.75rem;
      line-height: 1.4;
      margin-bottom: .5rem;
    }

    a {
      display: block;
      font-size: 0.75rem;
      line-height: 1.4;
      color: var(--fg2);
      word-break: break-all;

      &:hover {
        color: var(--link);
      }
    }
  }
}

.circle-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;

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

@media (max-width: 50rem) {

  .info {
    display: block;
    margin-bottom: 1rem;

    >.sub {
      padding: 1rem;
      margin-bottom: .5rem;
    }
  }

  .categories {
    display: block;

    .category {
      width: 100%;
      margin-bottom: .5rem;
    }
  }

  .params {
    .param {
      padding: 1rem;
      gap: 0.75rem;
      margin-bottom: 0rem;

      .icon-frame {
        padding-left: 0;
      }
    }
  }

}
</style>