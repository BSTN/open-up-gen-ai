<template>
  <section class="as-seen-in" id="as-seen-in">
    <div class="content-frame">
      <div class="context">
        <label>As seen in</label>
      </div>
      <div class="content" v-visiblecontainer>
        <NuxtLink :to="item.url" v-for="item in list.items" target="_blank" class="flex">
          <div class="image">
            <NuxtImg :src="`${item.image}`"></NuxtImg>
          </div>
          <div class="info">
            <div class="source">{{ item.source }} — {{ toDate(item.date) }}</div>
            <div class="title small">{{ item.title }}</div>
            <!-- <div class="date">{{ item.date }}</div> -->
            <Icon class="icon" icon="heroicons:arrow-top-right-on-square-20-solid"></Icon>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import moment from 'moment'
import list from "@/website/as-seen-in.yml"
import { Icon } from '@iconify/vue'
function toDate(notation: string) {
  return moment(notation, 'DD-MM-YYYY').format('LL')
}
</script>

<style lang="less" scoped>
.as-seen-in {}
</style>