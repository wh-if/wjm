<template>
  <ElCard class="menu-card-box">
    <ElTabs tab-position="left">
      <ElTabPane label="大纲">
        <div style="overflow-y: auto; height: 100%">
          <ElButton
            @click="handleClick('radio')"
            style="width: 90%; margin: 10px auto"
            bg
            text
          >
            单选
          </ElButton>
        </div>
      </ElTabPane>
      <ElTabPane label="题型"></ElTabPane>
      <ElTabPane label="题库"></ElTabPane>
    </ElTabs>
  </ElCard>
</template>

<script setup lang="ts">
import { addQuestionToSurvey } from "@/api/question";
import type { SurveyWithQuestions } from "@/api/survey";
import { ElCard, ElTabs, ElTabPane, ElButton } from "element-plus";
import { type Ref, inject } from "vue";

const surveyData = inject<Ref<SurveyWithQuestions>>("surveyData");

function handleClick(type: string) {
  addQuestionToSurvey(surveyData!.value.id!, type).then(({ data }) => {
    surveyData!.value.questions!.push(data);
  });
}
</script>

<style lang="scss">
.menu-card-box {
  .el-card__body {
    height: 100%;
    padding: 20px 0;
  }
  .el-tabs,
  .el-tabs__content,
  .el-tab-pane {
    height: 100%;
  }
}
</style>
