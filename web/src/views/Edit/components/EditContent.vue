<template>
  <div class="edit-content-box">
    <ElCard style="margin: 0 70px; overflow: visible">
      <!-- <QuestionCard>
        <div class="editable-box" contenteditable="true">
          <h1 style="text-align: center">jdksfsdf lidf wlfkw</h1>
        </div>
      </QuestionCard> -->
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
      <QuestionCard>
        <RadioQuestion :list-index="0"></RadioQuestion>
      </QuestionCard>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import type { SurveyWithQuestions } from "@/api/survey";
import EditInput from "@/components/EditInput.vue";
import QuestionCard from "@/components/QuestionCard.vue";
import RadioQuestion from "@/components/RadioQuestion.vue";
import { ElCard, ElInput } from "element-plus";
import { inject, ref, type Ref } from "vue";

const surveyData = inject<Ref<SurveyWithQuestions>>("surveyData")!;
</script>

<style lang="scss">
.edit-content-box {
  padding: 100px 0 0;
  .el-card__body {
    padding: 0;
  }
}
</style>
