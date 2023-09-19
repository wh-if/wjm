<template>
  <ElCard class="edit-left-menu-card">
    <ElTabs v-model="currentTab" tab-position="left">
      <ElTabPane label="大纲" :name="0">
        <div class="scroll-box">
          <ElText size="large" style="font-weight: bold" truncated>
            {{ surveyData.title }}
          </ElText>
          <ElText
            v-for="(item, index) in surveyData.questions"
            :key="item.id"
            truncated
          >
            {{ index + 1 + ". " + item.title }}
          </ElText>
        </div>
      </ElTabPane>
      <ElTabPane label="题型" :name="1">
        <div class="scroll-box">
          <div
            v-for="item in QuestionTypeList"
            :key="item.groupTitle"
            style="margin-bottom: 10px"
          >
            <p class="question-group-title">{{ item.groupTitle }}</p>
            <ElButton
              v-for="(i, index) in item.items"
              :key="index"
              @click="handleAddQuestion(index)"
              style="margin: 6px 0 0 8px"
              bg
              text
            >
              {{ i!.name }}
            </ElButton>
          </div>
        </div>
      </ElTabPane>
      <ElTabPane label="题库" :name="2"></ElTabPane>
    </ElTabs>
  </ElCard>
</template>

<script setup lang="ts">
import { addQuestionToSurvey } from "@/api/question";
import type { SurveyWithQuestions } from "@/api/survey";
import {
  QuestionTypeList,
  type QuestionTypeEnum,
  getDefaultContent
} from "@/constants";
import { ElCard, ElTabs, ElTabPane, ElButton, ElText } from "element-plus";
import { type Ref, inject, computed, ref } from "vue";

const currentTab = ref<0 | 1 | 2>(1);

const surveyContentRef = inject<Ref>("surveyContentRef");
const surveyData = computed(() => {
  if (surveyContentRef?.value?.surveyState) {
    return surveyContentRef.value.surveyState.data as SurveyWithQuestions;
  } else {
    return {} as SurveyWithQuestions;
  }
});

function handleAddQuestion(type: QuestionTypeEnum) {
  addQuestionToSurvey(
    surveyData!.value.id!,
    type,
    getDefaultContent(type)
  ).then(({ data }) => {
    surveyData!.value.questions!.push(data);
  });
}
</script>

<style lang="scss">
.edit-left-menu-card {
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

<style lang="scss" scoped>
.scroll-box {
  overflow-y: auto;
  height: 100%;
  .el-text {
    width: 100%;
  }
}
.question-group-title {
  height: 40px;
  font-size: 14px;
  line-height: 40px;
  font-weight: 500;
  margin-bottom: 0;

  color: #333;
}
</style>
