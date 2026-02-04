<script setup lang="ts">
import { ref } from 'vue'
import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html'

const pageInfo = ref(null)
const content = ref('')
</script>

<template>
  <div class="article-container" v-if="pageInfo != null">
    <div class="article-content">
      <mp-html
        :content="content"
        :tag-style="{
          p: 'margin:8px 0; line-height:1.8; font-size:15px; color:#333;',
        }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.article-container {
  background-color: $qs-pageBackGroundColor;
  padding: 30rpx;
  height: 100vh;
  font-family: sans-serif;
  color: $qs-font-title;
}

.article-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  line-height: 1.4;
}

.article-meta {
  font-size: 12px;
  color: $qs-font-dec2;
  margin-bottom: 16px;
}

.article-content p {
  font-size: 15px;
  line-height: 1.7;
  margin-bottom: 16px;
}

.article-image {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 16px;
}
</style>
