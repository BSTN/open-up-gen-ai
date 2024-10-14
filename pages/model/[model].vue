<template>
  <div class="page">
    <ModelInfo></ModelInfo>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()

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

<style lang="less" scoped></style>