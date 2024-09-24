<template>
  <div class="news">
    <label>Latest news</label>
    <div class="frame">
      <NuxtLink to="/list">A</NuxtLink>
      <NuxtLink to="/old-list">B</NuxtLink>
      <NuxtLink to="/compare">C</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="less" scoped>
.news {
  display: block;
  .row();
  padding: 2rem 0 2rem;

  label {
    margin-bottom: 2rem;
  }

  .frame {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 4rem;

    @media (max-width: 60rem) {
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    @media (max-width: 40rem) {
      display: block;
    }

    a {
      aspect-ratio: 4/2;
      background: var(--bc);
      text-decoration: none;
      padding: 2rem;
      font-size: 1.5rem;
      border-radius: 0.25rem;
      display: block;
    }
  }
}
</style>