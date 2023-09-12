<template>
  <ElCard class="right-setting-box">
    <ElTabs>
      <ElTabPane label="问卷设置">
        <!-- <ElForm v-if="activeQuestionIndex !== undefined">
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
        </ElForm> -->
        <!-- <div style="overflow-y: auto; height: 100%">
          
        </div> -->
      </ElTabPane>
      <ElTabPane label="题目设置">
        <ElForm v-if="activeQuestionIndex !== undefined">
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
import type { SurveyWithQuestions } from "@/api/survey";
import {
  ElCard,
  ElCheckbox,
  ElEmpty,
  ElForm,
  ElFormItem,
  ElOption,
  ElTabs
} from "element-plus";
import { computed, inject, type Ref } from "vue";

const activeQuestionIndex = inject<Ref<number>>("activeQuestionIndex");

const surveyData = inject<Ref<SurveyWithQuestions>>("surveyData");

const questionData = computed(
  () => surveyData?.value.questions![activeQuestionIndex!.value | 0]
);
</script>

<style lang="scss" scoped>
.right-setting-box {
  .el-card__body {
    height: 100%;
    padding: 20px 0;
  }
}
</style>
