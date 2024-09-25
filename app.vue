<template>
  <div class="app" :class="[{ top: !nottop, nottop }, direction]" :path="$route.path">
    <Mainmenu></Mainmenu>
    <NuxtPage class="page"></NuxtPage>
    <Mainfooter></Mainfooter>
  </div>
</template>
<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
const store = useMyComparisonStore()
const router = useRouter()
// scroll directions
const direction = ref('')
const { y } = useWindowScroll()
let prevy = 0
const nottop = computed(() => {
  direction.value = (y.value > prevy) ? 'scroll-down' : 'scroll-up'
  prevy = y.value
  return y.value > 150
})
// end


</script>
<style lang="less">
@import '@/less/elements.less';

.page {
  min-height: calc(100vh - 8rem);
  padding: 0 0 4rem;

  >*:first-child {
    .app:not([path='/']) & {
      margin-top: 10rem !important;

      @media (max-width: 50rem) {
        margin-top: 6rem !important;
      }
    }
  }

  p {
    width: var(--pwidth);
    ;
    max-width: var(--maxwidth);
    margin: 0 auto 1rem;
  }
}
</style>
