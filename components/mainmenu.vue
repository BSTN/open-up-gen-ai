<template>
  <div class="mainmenu">
    <div class='left'>
      <NuxtLink :to="item.link" v-for="item in menu.left" :target="item.target" :class="{ withIcon: !!item.icon }">
        <span v-if="item.name">{{ item.name }}</span>
        <Icon :icon="item.icon" v-if="item.icon"></Icon>
      </NuxtLink>
    </div>
    <div class='right'>
      <NuxtLink :to="item.link" v-for="item in menu.right" :target="item.target" :class="{ withIcon: !!item.icon }">
        <span v-if="item.name">{{ item.name }}</span>
        <Icon :icon="item.icon" v-if="item.icon"></Icon>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import menu from '@/website/menu.yml'
</script>

<style lang="less" scoped>
.mainmenu {
  display: flex;
  .row();
  margin-top: 3rem;
  margin-bottom: 3rem;

  .left {
    flex: 1;
  }
}

.left,
.right {
  display: flex;
  align-items: center;
  gap: 3rem;
}

a {
  text-decoration: none;
  line-height: 1;

  &:not(.withIcon) {
    padding-bottom: 0.2em;
  }

  &:hover {
    text-decoration: underline;
  }
}
</style>