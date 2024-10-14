<template>
  <section class="news" id="news">
    <div class="content-frame">
      <div class="context">
        <label>Latest news</label>
      </div>
      <div class="content" v-visiblecontainer>
        <ContentList :query="query" v-slot="{ list }">
          <NuxtLink :to="article._path" v-for="article in list" :key="article._path">
            <div class="date">{{ toDate(article.date) }}</div>
            <div class="title">{{ article.title }}</div>
            <!-- <div class="description">{{ article.description }}</div> -->
          </NuxtLink>
        </ContentList>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import moment from 'moment'
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'
const query: QueryBuilderParams = { path: '/news', limit: 10, sort: [{ date: -1 }] }
function toDate(time: string) {
  return moment(time, 'DD-MM-YYYY').format('LL')
}
</script>

<style lang="less" scoped>
.news {}
</style>