<template>
  <NuxtLink :to="data.url">
    {{ commitDate }}
  </NuxtLink>
</template>

<script lang="ts" setup>
import websiteInfo from '@/repos/website/.info.json'
import dataInfo from '@/repos/data/.info.json'
import moment from 'moment'
const data = computed(() => {
  return props.repo === 'website' ? websiteInfo : dataInfo
})
const props = defineProps(['repo'])
const commitDate = computed(() => {
  return moment(data.value.date).format('DD MMMM YYYY')
})
</script>

<style lang="less" scoped></style>