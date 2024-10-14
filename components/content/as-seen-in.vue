<template>
  <div class="as-seen-in">
    <div class="content-frame">
      <div class="context">
        <label>As seen in</label>
      </div>
      <div class="content" v-visiblecontainer>
        <NuxtLink :to="item.url" v-for="item in list.items" target="_blank">
          <div class="image">
            <NuxtImg :src="`${item.image}`"></NuxtImg>
          </div>
          <div class="info">
            <div class="source">{{ item.source }} — {{ toDate(item.date) }}</div>
            <div class="title">{{ item.title }}</div>
            <!-- <div class="date">{{ item.date }}</div> -->
            <Icon class="icon" icon="heroicons:arrow-top-right-on-square-20-solid"></Icon>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import moment from 'moment'
import list from "@/website/as-seen-in.yml"
import { Icon } from '@iconify/vue'
function toDate(notation: string) {
  return moment(notation, 'DD-MM-YYYY').format('LL')
}
</script>

<style lang="less" scoped>
.as-seen-in {

  .content {
    flex: 1;

    a {
      display: block;
      text-decoration: none;
      margin-bottom: 1rem;
      display: flex;
      gap: 1.5rem;
      min-height: 4rem;
      border-top: 1px solid var(--bc);
      padding-top: 0.5rem;

      .image {

        img {
          background: var(--bg2);
          width: 5rem;
          border-radius: 0.125rem;
          aspect-ratio: 2/1;
          object-fit: contain;
          border: .5rem solid transparent;

          .dark & {
            background: var(--fg);
          }
        }
      }

      .info {
        width: 20rem;

        .title {
          margin-bottom: 0.25rem;
        }

        .source {
          color: var(--fg2);
          font-size: 0.75rem;
        }

        .icon {
          display: none;
          color: var(--fg2);
        }
      }

      &:hover {
        .title {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>