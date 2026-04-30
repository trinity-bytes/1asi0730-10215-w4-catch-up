<script setup>
/**
 * @component ArticleList
 * @description Presentation component that renders a scrollable list of
 * {@link Article} domain entities.
 *
 * Iterates over the supplied `articles` array and delegates the rendering
 * of each item to the {@link ArticleItem} component.
 *
 * ### Props
 * | Name       | Type       | Required | Description                              |
 * |------------|------------|----------|------------------------------------------|
 * | `articles` | `Article[]`| yes      | Ordered list of articles to display.     |
 */
import {toRefs} from "vue";
import ArticleItem from "./article-item.vue";

const props = defineProps({ articles: { type: Array, required: true }});
const { articles } = toRefs(props);
</script>

<template>
  <div class="article-grid">
    <div v-for="article in articles" :key="article.id" class="article-card">
      <article-item :article="article"/>
    </div>
  </div>
</template>

<style scoped>
  .article-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 768px) {
    .article-grid {
      grid-template-columns: 1fr;
    }
  }
</style>