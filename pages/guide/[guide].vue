<template>
  <div class="guide">
    <div class="frame">
      <ContentDoc :path="pad">
        <template #not-found>
          <div class="not-found">
            Page not found
          </div>
        </template>
      </ContentDoc>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const pad = computed(() => {
  return `/guides/${route.params.guide}`
})
</script>

<style lang="less" scoped>
.guide {
  .row();
}
</style>