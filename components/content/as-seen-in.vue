<template>
  <div class="as-seen-in">
    <label>As seen in</label>
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
.as-seen-in {
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