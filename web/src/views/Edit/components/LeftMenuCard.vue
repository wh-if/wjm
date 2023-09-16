<template>
  <ElCard class="menu-card-box">
    <ElTabs v-model="currentTab" tab-position="left">
      <ElTabPane label="大纲" :name="0">
        <div class="scroll-box">
          <ElText size="large" style="font-weight: bold;" truncated>
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
      <ElTabPane label="题库" :name="2"></ElTabPane>
    </ElTabs>
  </ElCard>
</template>

<script setup lang="ts">
import { addQuestionToSurvey } from "@/api/question";
import type { SurveyWithQuestions } from "@/api/survey";
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
  .scroll-box {
    overflow-y: auto;
    height: 100%;
    .el-text{
      width: 100%;
    }
  }
}
</style>
