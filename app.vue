<template>
  <div class="app" :class="[{ top: !nottop, nottop }, direction]" :path="$route.path">
    <Mainmenu></Mainmenu>
    <NuxtPage class="page"></NuxtPage>
    <Mainfooter></Mainfooter>
    <button class="compare" @click="openComparison()" v-if="store.selected.length > 0">Compare {{
      store.selected.length }} models</button>
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

function openComparison() {
  router.push(`/compare?models=${store.selected.join(',')}`)
}
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

button.compare {
  position: fixed;
  bottom: 0;
  left: 0;
  margin: 2rem;
  padding: 0.5rem 0.75rem;
  background: var(--fg);
  color: var(--bg);

  &:hover {
    background: var(--link);
    color: var(--bg);
  }
}
</style>
