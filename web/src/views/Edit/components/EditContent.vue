<template>
  <div class="edit-content-box">
    <!-- <ElCard style="margin: 0 70px; overflow: visible">
      <QuestionCard>
        <EditInput
          v-model="surveyData.title"
          :text-box-style="{ fontSize: '2.5rem', textAlign: 'center' }"
        >
        </EditInput>
      </QuestionCard>
      <QuestionCard>
        <EditInput v-model="surveyData.description"> </EditInput>
      </QuestionCard>
      <QuestionCard
        v-for="(item, index) in surveyData.quesitons"
        :key="item.id"
      >
        <RadioQuestion :list-index="index"></RadioQuestion>
      </QuestionCard>
    </ElCard> -->
    <SurveyContent  :is-edit="true"></SurveyContent>
  </div>
</template>

<script setup lang="ts">
import SurveyContent from "@/components/SurveyContent.vue";
</script>

<style lang="scss">
.edit-content-box {
  padding: 100px 0 0;
  .el-card__body {
    padding: 0;
  }
}
</style>
  