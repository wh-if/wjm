<template>
  <div class="edit-content-box">
    <SurveyContent :is-edit="true"></SurveyContent>
  </div>
</template>

<script setup lang="ts">
import SurveyContent from "@/components/SurveyContent.vue";
</script>

<style lang="scss" scoped>
.edit-content-box {
  padding: 100px 0 0;
}
</style>
