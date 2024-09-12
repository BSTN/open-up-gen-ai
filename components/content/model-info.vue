<template>
  <div class="model-info">
    <div class="frame">
      <div class="top-info" :style="bg(model.score)">
        <h1>{{ model.project.name || '(undefined)' }}</h1>
        <h2>by {{ model.org.name || '(undefined)' }}</h2>
        <div class="score">Average score: {{ model.score.toFixed(2) }}</div>
      </div>
      <ModelInfoFold :filename="route.query.model"></ModelInfoFold>
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
  }
}

.top-info {
  padding: 4rem 2rem;
  // border: 1px solid var(--bc);
  color: var(--listfg);

  h1 {
    margin-bottom: 1rem;
    text-align: center;
  }

  h2 {
    text-align: center;
    margin-top: 0;
  }

  .score {
    text-align: center;
  }
}
</style>