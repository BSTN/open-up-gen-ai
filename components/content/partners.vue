<template>
  <div class="partners">
    <label>Partners</label>
    <div class="frame">
      <NuxtLink to="/list">A</NuxtLink>
      <NuxtLink to="/old-list">B</NuxtLink>
      <NuxtLink to="/compare">C</NuxtLink>
      <NuxtLink to="/compare">D</NuxtLink>
      <NuxtLink to="/compare">E</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="less" scoped>
.partners {
  display: block;
  .row();
  padding: 4rem 0;

  label {
    margin-bottom: 2rem;
  }

  .frame {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    gap: 4rem;

    a {
      aspect-ratio: 4/2;
      background: var(--bc);
      text-decoration: none;
      padding: 2rem;
      font-size: 1.5rem;
      border-radius: 0.25rem;
    }
  }
}
</style>