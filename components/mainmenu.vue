<template>
  <div class="mainmenu" ref="menuelement" :class="{ active, afteractive }">
    <div class="frame">
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
        <button class="darkmode" @click="toggleDark()">
          <Icon class="light-icon" icon="ic:baseline-light-mode"></Icon>
          <Icon class="dark-icon" icon="ic:round-dark-mode"></Icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import menu from '@/website/menu.yml'
const active = ref(false)
const afteractive = ref(false)
const isDark = useDark()
const toggleDark = useToggle(isDark)
onMounted(() => {
  setTimeout(() => { active.value = true }, 500)
  setTimeout(() => { afteractive.value = true }, 2500)
})
</script>

<style lang="less" scoped>
.mainmenu {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 99;
  padding-top: 3rem;
  padding-bottom: 3rem;
  transition: all 3s ease;
  opacity: 0;

  &.active {
    transition: all 2s ease;
    opacity: 1;
  }

  &.afteractive {
    transition: all 0.2s ease !important;
  }

  .top & {
    transition-delay: 0s;
  }

  .nottop & {
    transition: all 0.2s ease !important;
    background: var(--bg);
    padding-top: 1rem;
    padding-bottom: 1rem;
    box-shadow: 0 0 .25rem var(--shadow);
  }

  .scroll-down.nottop & {
    transform: translateY(-.5rem);
    opacity: 0;
    pointer-events: none;
  }

  .scroll-up & {
    transform: translateY(0);
  }

  .frame {
    display: flex;
    .row();
  }

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

button.darkmode {
  border-radius: 0.75em;
  background: var(--bg2);
  position: relative;
  margin: 0;
  height: 1.25em;
  width: 2.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;

  .dark-icon {
    opacity: 0;
  }

  .light-icon {
    opacity: 1;
  }

  :deep(svg) {
    position: relative;
    z-index: 2;
    color: var(--bg);
  }

  &:after {
    content: "";
    width: calc(100% - 1em);
    height: 100%;
    background: var(--fg);
    border-radius: inherit;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(0rem);
    transition: all 2.5s ease;

    .dark & {
      transform: translateX(1em);
    }
  }

  :root.dark & {
    .dark-icon {
      opacity: 1;
    }

    .light-icon {
      opacity: 0;
    }


  }
}

a {
  text-decoration: none;
  line-height: 1;

  &.router-link-active {
    text-decoration: underline;
  }

  &:not(.withIcon) {
    padding-bottom: 0.2em;
  }

  &:hover {
    text-decoration: underline;
  }

  &[href="/"] {
    .app[path="/"] & {
      display: none;
    }
  }
}
</style>