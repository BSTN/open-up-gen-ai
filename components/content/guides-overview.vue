<template>
  <div class="guides-overview">
    <ContentList path="/guides/" v-slot="{ list }">
      <NuxtLink class="guide" :to="article._path" v-for="article in list" :key="article._path">
        <div class="date">{{ article.date }}</div>
        <div class="title">{{ article.title }}</div>
      </NuxtLink>
    </ContentList>
    <!-- <NuxtLink :to="`/guide/${item.link}`" class="guide" v-for="item in guides">
      <div class="date">{{ item.props.date }}</div>
      <div class="title">{{ item.props.title }}</div>
    </NuxtLink> -->
  </div>
</template>

<script lang="ts" setup>
// const websites = import.meta.glob('@/repos/website/website/*.md')
const fileList = await import.meta.glob('@/website/pages/guides/*.md')
const guides = []
for (let i in fileList) {
  const g = await fileList[i]()
  const link = i.split('/').reverse()[0].replace(/\.md$/i, '')
  guides.push({ link, props: g.attributes, html: g.html });
}
guides.sort((a, b) => new Date(a.props.date).getTime() < new Date(a.props.date).getTime() ? 1 : -1)

</script>

<style lang="less" scoped>
.guides-overview {
  .row();
}

.guide {
  margin: 0 auto 4rem;
  width: 40rem;
  max-width: 100%;
  background: var(--bg2);
  padding: 1.5rem 2rem;
  border-radius: 0.5rem;
  display: block;
  text-decoration: none;
  aspect-ratio: 8/3;

  .date {
    text-align: right;
  }

  .title {
    font-size: 2rem;
    line-height: 1.4;
  }
}
</style>