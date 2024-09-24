<template>
  <div class="guides">
    <label>Guides</label>
    <div class="frame">
      <NuxtLink to="/list">Generative AI: an overview</NuxtLink>
      <NuxtLink to="/old-list">Generative AI: a list</NuxtLink>
      <NuxtLink to="/old-grid">Quick comparison</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="less" scoped>
.guides {
  display: block;
  .row();
  padding: 4rem 0 2rem;

  label {
    margin-bottom: 2rem;
  }

  .frame {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 4rem;

    @media (max-width: 70rem) {
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 40rem) {
      display: block;
    }

    a {
      aspect-ratio: 4/5;
      background: var(--bc);
      text-decoration: none;
      padding: 2rem;
      font-size: 1.5rem;
      border-radius: 0.25rem;
      line-height: 1.4;
      display: block;
    }
  }
}
</style>