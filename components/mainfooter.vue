<template>
  <div class="mainfooter">
    {{ info.sha }}
    {{ info.commit.author.name }}
    {{ info.commit.committer.name }}
    {{ info.commit.author.date }}

    <ContentDoc path="/footer" />
  </div>
</template>

<script lang="ts" setup>
import info from '@/repos/opening-up-chatgpt-opening-up-chatgpt.github.io/.info.json';
</script>

<style lang="less" scoped>
.mainfooter {
  .row();
  font-size: 0.75rem;
  margin-top: 2rem;
  margin-bottom: 4rem;
}
</style>