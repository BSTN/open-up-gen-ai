<template>
  <div class="guides">
    <div class="content-frame">
      <div class="context">
        <label>Guides</label>
      </div>
      <div class="content" v-visiblecontainer>
        <ContentList :query="query" v-slot="{ list }">
          <NuxtLink :to="article._path" v-for="article in list" :key="article._path">
            <div class="title">{{ article.title }}</div>
            <div class="description">{{ article.description }}</div>
          </NuxtLink>
        </ContentList>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'
const query: QueryBuilderParams = {
  path: '/guides/', limit: 99, where: [{
    _file: {
      $not: /\.(.*).md$/
    }
  }]
}
</script>

<style lang="less" scoped>
.guides {
  margin-top: 4rem;
  margin-bottom: 4rem;

  .content {

    >a {
      display: block;
      margin-bottom: 2rem;
      text-decoration: none;
      border-top: 1px solid var(--bc);
      width: 100%;
      padding-top: 0.5rem;

      .title {
        font-size: 1.5rem;
      }

      .description {
        color: var(--fg2);
      }

      &:hover {
        .title {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>