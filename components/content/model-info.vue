<template>
  <div class="model-info">
    <div class="frame">
      <div class="top-info">
        <h1>{{ model.project.name || '(undefined)' }}</h1>
        <h2>by {{ model.org.name || '(undefined)' }}</h2>
        <scorebar :score="model.score" :style="{ '--fg': color(model.score) }"></scorebar>
      </div>
      <ModelInfoFold :filename="route.params.model"></ModelInfoFold>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { models, categories, bg, color } = useModels()
const route = useRoute()
const model = computed(() => {
  const pad = route.params.model
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
  padding: 0rem 0 2rem;
  color: var(--fg);

  :deep(.scorebar) {
    --bg: var(--bg3);
    --sb-height: 1rem;
    width: 20rem;
    max-width: 80%;
    margin: 0 0 1rem;
  }

  h1 {
    font-size: 3rem;
    margin-bottom: .5rem;
    text-align: left;
    width: 100%;
  }

  h2 {
    text-align: left;
    width: 100%;
    margin-top: 0;
    margin-bottom: 2rem;
    color: var(--fg2);
  }

  .score {
    text-align: center;
    color: var(--fg2);
    font-size: 0.75rem;
  }
}
</style>