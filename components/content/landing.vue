<template>
  <div class="landing" ref="mainelement">
    <div class="frame" :style="{ transform: `translateY(${y / 2}px)`, opacity: 1 - (y / height) }">
      <div class="animation-frame">
        <slot></slot>
      </div>
    </div>
    <div class="notesframe" :style="{ opacity: 1 - (y / height * 2) }">
      <div class="notes">
        <ContentSlot :use="$slots.notes"></ContentSlot>
      </div>
    </div>
    <!-- <div class="globe" v-html="globe"></div> -->
  </div>
</template>

<script lang="ts" setup>
import globe from '@/assets/sphere.svg?raw'
import { useWindowScroll, useWindowSize } from '@vueuse/core'
const mainelement = ref(null)
const top = ref(0)
const { y } = useWindowScroll()
const { height } = useWindowSize()
</script>

<style lang="less" scoped>
@keyframes landin {
  100% {
    opacity: 1;
    transform: translateY(0rem);
  }
}

.landing {
  height: calc(100vh - 4rem);
  margin-bottom: 4rem;
  position: relative;
  background: var(--bg3);
  margin-top: 0 !important;
  overflow: hidden;
  display: flex;
  // align-items: center;
  justify-content: center;
  padding-top: 8rem;

  .frame {
    display: block;
    position: relative;
    z-index: 2;
    overflow: visible;
    .row();

    .animation-frame {
      opacity: 0;
      // transform: scale(.9);
      transform: translateY(2rem);
      transform-origin: top left;
      animation: landin 2s @easeInOutExpo 0.25s 1 forwards;


    }

    :deep(h1) {
      font-size: 3rem;
      width: 9.55em;
      text-align: left;
      margin: 0 0 2rem;
    }

    :deep(p) {
      margin: 0 0 1rem;
      width: 28em;
    }

    :deep(.animation-frame > p > a) {
      background: var(--fg);
      color: var(--bg);
      text-decoration: none;
      border-radius: 0.25rem;
      padding: 0.5em 1em;
      margin-top: 0.5em;
      display: inline-block;
      margin-right: 1em;
      font-size: 0.75rem;
      font-weight: 600;

      &:hover {
        background: var(--link);
      }
    }

    :deep(.note) {
      margin: 4rem 0 0 0;
    }
  }
}

.notesframe {
  position: absolute;
  left: 0;
  bottom: 2rem;
  font-size: 0.75rem;
  width: 100%;

  .notes {
    .row();
    color: var(--fg2);

    :deep(p) {
      margin: 0;
      width: 26rem;
    }
  }
}

.globe {
  position: absolute;
  left: 20%;
  top: 20%;
  width: 120%;
  height: 120%;
  z-index: 1;
  opacity: 0.2;
  animation: landin 2s @easeInOutExpo 0.25s 1 forwards;

  :deep(svg) {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    g {
      fill: var(--bg2);
      stroke: var(--bg2);
    }
  }
}
</style>