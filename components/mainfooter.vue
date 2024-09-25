<template>
  <div class="mainfooter">
    <div class="frame">
      <ContentDoc path="/footer" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import info from '@/repos/data/.info.json';
</script>

<style lang="less" scoped>
.mainfooter {
  .frame {
    .row();
  }

  margin-top: 2rem;
  font-size: 0.75rem;
  padding-top: 2rem;
  padding-bottom: 3rem;
  color: var(--fg2);
  background: var(--bg3);
}
</style>