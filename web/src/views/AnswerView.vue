<template>
  <div class="content-box">
    <SurveyContent
      :type="$route.name === 'answer' ? 'Answer' : 'Review'"
    ></SurveyContent>
  </div>
</template>

<script setup lang="ts">
import SurveyContent from "@/components/SurveyContent.vue";
</script>

<style lang="scss" scoped>
.content-box {
  margin: 150px auto 50px;
  width: 70%;
}
</style>
