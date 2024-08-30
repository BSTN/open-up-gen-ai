<template>
  <div class="model-info">
    <div class="frame">
      <div class="info" :style="bg(model.score)">
        <h1>{{ model.project.name }}</h1>
        <NuxtLink :to="model.project.link">{{ model.project.link }}</NuxtLink>
        <div class="notes">{{ model.project.notes }}</div>
        <h2>by {{ model.org.name }}</h2>
        <NuxtLink :to="model.org.link">{{ model.org.link }}</NuxtLink>
        <div class="notes">{{ model.org.notes }}</div>
        <div class="score"> {{ model.score.toFixed(2) }}</div>
      </div>
      <div class="params">
        <div class="category" v-for="category in categories">
          <div class="category-bar" :style="bg(model.categories[category.ref])">
            <div class="category-name">{{ category.name }}</div>
            <div class="category-score">{{
        model.categories[category.ref].toFixed(2)
      }}</div>
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
                <div class="param-name">{{ param.name }}</div>
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
import openIcon from '@/assets/icons/open.svg?raw'
import closedIcon from '@/assets/icons/closed.svg?raw'
import partialIcon from '@/assets/icons/partial.svg?raw'

const { models, categories, bg } = useModels()
const route = useRoute()
const model = computed(() => {
  const pad = route.query.model
  return models.value.find(x => x.filename === pad)
})
</script>

<style lang="less" scoped>
.model-info {
  .frame {
    .row();
    display: flex;
    gap: 3rem;
    align-items: flex-start;
  }
}

.info {
  text-align: left;
  color: var(--bg);
  padding: 2rem;
  border-radius: 0.25rem;
  width: 30rem;
  max-width: 30vw;

  h1,
  h2 {
    text-align: left;
    margin: 0 0 1rem;
    max-width: 100%;
    line-height: 1.1;
  }

  .notes {
    margin-bottom: 2rem;
  }

  .score {
    font-size: 2rem;
    font-weight: 600;
    text-align: right;
  }
}

.params {
  grid-column-start: 2;
  grid-column-end: 5;

  .category {
    margin-bottom: 4rem;

    .category-bar {
      display: flex;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1rem;
      color: var(--bg);
      padding: 0.25rem 1rem;
      border-radius: 0.25rem;
      font-size: 1.25rem;
      line-height: 1.4;

      .category-name {
        padding: 0;
        flex: 1;
      }

      .category-score {
        text-align: right;
        flex-shrink: 0;
      }
    }
  }

  h2 {
    margin: 0;
  }


  .param {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;

    .icon-frame {
      width: 3rem;
      text-align: left;
      padding-left: 1rem;

      .circle-icon {
        flex-shrink: 0;
        display: inline-block;
      }
    }

    .param-name {
      font-weight: 600;
    }

    .notes {
      color: var(--fg2);
      width: 32em;
      max-width: 100%;
    }

    a {
      font-size: 0.75rem;
    }
  }
}

.circle-icon {
  width: 1.5rem;
  height: 1.5rem;

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
</style>