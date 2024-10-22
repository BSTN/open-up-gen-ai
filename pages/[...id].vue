<template>
  <div class="page" ref="element" path="/">
    <ContentDoc :path="finalPath">
      <template #not-found>
        <div class="not-found">Page not found.</div>
      </template>
    </ContentDoc>
  </div>
</template>

<script lang="ts" setup>
import { asyncComputed } from '@vueuse/core'
const route = useRoute()
const pageKey = computed(() => {
  return Array.isArray(route.params) ? route.params.join('') : route.params
})
const { markdownPath } = useLanguage()
const finalPath = asyncComputed(async () => {
  const res = await queryContent(markdownPath.value).findOne().catch(err => {
    //
  })
  if (!res) { return route.fullPath }
  return markdownPath.value
})

const element = ref<HTMLElement | null>(null)

onMounted(() => {
  if (element.value) element.value.setAttribute('path', route.path)
})

definePageMeta({
  pageTransition: {
    name: "page",
    mode: "out-in",
    onEnter(el, done) {
      const route = useRoute()
      el.setAttribute('path', route.fullPath)
    },
  }
})
</script>

<style lang="less">
.page:not([path='/']) & {
  margin-top: 14rem !important;

  @media (max-width: 60rem) {
    margin-top: 14rem !important;
  }
}
</style>