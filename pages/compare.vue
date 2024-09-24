<template>
  <div class="compare">
    <div class="frame">
      <div class="names">
        <div class="model-name" v-for="(model, k) in modelsList">
          <div class="count">{{ k + 1 }}/{{ modelsList.length }}</div>
          <NuxtLink :to="`/model/${model.filename}`" class="name">{{ model.project.name }}</NuxtLink>
          <div class="org">by {{ model.org.name || '(undefined)' }}</div>
        </div>
      </div>
      <div class="category" v-for="cat in categories">
        <category class="model-category" :category="cat" :model="model" v-for="model in modelsList"></category>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const store = useMyComparisonStore()
const { models, categories } = useModels();
const route = useRoute()

const modelsList = computed(() => {
  if (!route.query?.models || typeof route.query.models !== 'string') { return false }
  const filenames = route.query.models.split(',')
  const list = filenames.map(x => {
    return getModel(x)
  }).filter(x => x)
  return list
})

function getModel(filename: string) {
  if (!filename) return false
  return models.value.find(x => x.filename === filename)
}
</script>

<style lang="less" scoped>
.compare {}

.frame {
  .row();
  display: table;
  padding: 2rem;
  border-top: 1px solid var(--bc);
  border-radius: 0;

  >div {
    display: flex;
    gap: 2rem;
    margin-bottom: 1rem;

    >div {
      width: 20rem;
      flex: 1;
    }

  }

  .names {
    position: sticky;
    top: 0;
    background: var(--bg);
    z-index: 20;
    transition: all 0.2s ease;

    .scroll-up.nottop & {
      top: 3.2rem;
      transition-delay: 0.25s;
    }
  }
}

.model-name {
  background: var(--bg2);
  padding: 1rem;
  border-radius: 0.25rem;
  border-bottom: 2px solid var(--bg);


  .count {
    float: right;
    color: var(--fg2);
    font-size: 0.75rem;
  }

  a {
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }

  .org {
    font-size: 0.75rem;
  }
}

:deep(.category) {
  .category-bar {
    padding: 1rem;
    margin-bottom: 1rem;
  }
}
</style>