<template>
  <ContentDoc>
    <template #not-found>
      <div class="not-found">Page not found.</div>
    </template>
  </ContentDoc>
</template>

<script lang="ts" setup>
const route = useRoute()
</script>

<style lang="less" scoped></style>