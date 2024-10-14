<template>
  <div class="partners">
    <label>Partners</label>
    <div class="frame">
      <NuxtLink to="/"></NuxtLink>
      <NuxtLink to="/"></NuxtLink>
      <NuxtLink to="/"></NuxtLink>
      <NuxtLink to="/"></NuxtLink>
      <NuxtLink to="/"></NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="less" scoped>
.partners {
  display: block;
  .row();
  padding: 2rem 0 2rem;

  label {
    margin-bottom: 2rem;
  }

  .frame {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    gap: 4rem;

    @media (max-width: 60rem) {
      grid-template-columns: 1fr 1fr 1fr;
      gap: 2rem;
    }

    @media (max-width: 40rem) {
      display: block;
    }

    a {
      aspect-ratio: 4/2;
      border: 1px solid var(--bc);
      text-decoration: none;
      padding: 2rem;
      font-size: 1.5rem;
      border-radius: 0.25rem;
      display: block;
    }
  }
}
</style>