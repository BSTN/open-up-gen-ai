<template>
  <div class="landing" ref="mainelement">
    <div class="frame" :style="{ transform: `translateY(${y / 2}px)`, opacity: 1 - (y / height) }">
      <NuxtImg src="/images/sphere.png" class="sphere"></NuxtImg>
      <div class="animation-frame">
        <!-- <logoname class="logo"></logoname> -->
        <div class="slot">
          <slot></slot>
        </div>
        <div class="notesframe" :style="{ opacity: 1 - (y / height * 2) }">
          <div class="notes">
            <ContentSlot :use="$slots.notes"></ContentSlot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import logoname from '@/website/images/logo2-name-c.svg?component';
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
  min-height: 45rem;
  margin-bottom: 4rem;
  position: relative;
  background: var(--bg2);
  margin-top: 0 !important;
  overflow: hidden;
  display: flex;
  // align-items: center;
  justify-content: center;
  padding-top: 8rem;

  .frame {
    display: block;
    position: relative;
    z-index: 3;
    overflow: visible;
    .row();
    display: flex;
    align-items: flex-end;
    padding-bottom: 4rem;

    .logo {
      margin-bottom: 2rem;
      max-width: 100%;
      margin: 0 auto 2rem;
      display: block;
      width: 10rem;

      :deep(path) {
        fill: var(--fg);
      }
    }

    .animation-frame {
      opacity: 0;
      // transform: scale(.9);
      transform: translateY(2rem);
      transform-origin: top left;
      animation: landin 2s @easeInOutExpo 0.25s 1 forwards;
      position: relative;
      z-index: 2;
      width: 100%;
      font-size: 1.5rem;
      font-family: 'InterDisplay', 'Helvetica Neue', Helvetica, sans-serif;

      padding-top: 0;

      .slot {
        margin-bottom: 2rem;
      }
    }

    :deep(h1) {
      font-size: 3rem;
      width: 9.55em;
      text-align: left;
      margin: 0 0 2rem;
      font-family: 'InterDisplay', 'Helvetica Neue', Helvetica, sans-serif;
    }

    :deep(p) {
      margin: 0 0 1rem;
      width: 20em;
      max-width: 100%;
      color: var(--fg);
    }

    :deep(.animation-frame > .slot > p > a) {
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
  }
}

.notesframe {
  right: 0;
  // left: 0;
  // bottom: 2rem;
  font-size: 0.75rem;
  width: 20rem;
  z-index: 4;


  .notes {
    // .row();
    opacity: 0.5;

    :deep(p) {
      margin: 0;
      width: 26rem;
      width: 100%;
      color: var(--fg2);
    }

    &:hover {
      opacity: 1;
    }
  }
}

.sphere {
  position: absolute;
  bottom: -20%;
  right: -0vw;
  transform: scale(1.2);
  width: 55%;
  aspect-ratio: 1/1;
  opacity: 0.5;
  z-index: 1;

  bottom: -50%;
  right: -25%;
  width: 65%;

  // width: 40%;
  // bottom: 20%;
  // right: 20%;
  // display: none;
  @media (orientation: portrait) and (max-width: 70rem) {
    width: 150%;
    right: -25%;
    top: 50%;
    opacity: 0.25;
  }
}
</style>