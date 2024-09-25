<template>
  <div class="mainfooter">
    <ContentDoc path="/footer" />
  </div>
</template>

<script lang="ts" setup>
import info from '@/repos/data/.info.json';
</script>

<style lang="less" scoped>
.mainfooter {
  .row();
  font-size: 0.75rem;
  margin-top: 2rem;
  margin-bottom: 4rem;
  color: var(--fg2);
}
</style>