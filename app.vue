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

const route = useRoute()
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
</style>
