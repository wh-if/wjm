<template>
  <ElCard class="right-setting-box">
    <ElTabs>
      <ElTabPane label="问卷设置">
        <ElForm v-if="!!surveyData" label-position="top">
          <ElFormItem label="问卷状态">
            <ElSelect v-model="surveyData.status" placeholder="题目类型">
              <ElOption label="停止" value="0" />
              <ElOption label="开启" value="1" />
            </ElSelect>
          </ElFormItem>
          <!-- <ElFormItem>
            <ElCheckbox
              v-model="questionData!.required"
              label="必答题"
              size="large"
            />
          </ElFormItem> -->
        </ElForm>
        <!-- <div style="overflow-y: auto; height: 100%">
          
        </div> -->
      </ElTabPane>
      <ElTabPane label="题目设置">
        <ElForm v-if="!!questionData">
          <ElFormItem>
            <ElSelect v-model="questionData!.type" placeholder="题目类型">
              <ElOption :label="'单选'" :value="'radio'" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem>
            <ElCheckbox
              v-model="questionData!.required"
              label="必答题"
              size="large"
            />
          </ElFormItem>
        </ElForm>
        <ElEmpty v-else description="请选择题目"></ElEmpty>
        <!-- <div style="overflow-y: auto; height: 100%">
          
        </div> -->
      </ElTabPane>
    </ElTabs>
  </ElCard>
</template>

<script setup lang="ts">
import type { Question } from "@/api/question";
import type { SurveyWithQuestions } from "@/api/survey";
import {
  ElCard,
  ElCheckbox,
  ElEmpty,
  ElForm,
  ElFormItem,
  ElOption,
  ElTabs,
  ElSelect
} from "element-plus";
import { computed, inject, type Ref } from "vue";

const surveyContentRef = inject<Ref>("surveyContentRef");

const surveyData = computed(() => {
  if (surveyContentRef?.value?.surveyState) {
    return surveyContentRef.value.surveyState.data as SurveyWithQuestions;
  } else {
    return {} as SurveyWithQuestions;
  }
});

const focusQuestionIndex = computed(
  () => surveyContentRef?.value?.focusQuestionIndex
);

const questionData = computed(() => {
  if (focusQuestionIndex.value !== undefined) {
    return surveyData.value.questions![focusQuestionIndex.value] as Question;
  } else {
    return undefined;
  }
});
</script>

<style lang="scss" scoped>
.right-setting-box {
  .el-card__body {
    height: 100%;
    padding: 20px 0;
  }
}
</style>
