<template>
  <div class="app">
    <Mainmenu></Mainmenu>
    <ContentDoc class="page" />
    <Mainfooter></Mainfooter>
  </div>
</template>
<style lang="less">
@import '@/less/elements.less';

.page {
  min-height: calc(100vh - 8rem);
  padding: 2rem 0 4rem;

  p {
    width: var(--pwidth);
    ;
    max-width: var(--maxwidth);
    margin: 0 auto 1rem;
  }
}
</style>
