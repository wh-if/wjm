<template>
  <ElCard class="right-setting-box">
    <ElTabs>
      <ElTabPane label="问卷设置">
        <ElForm v-if="!!surveyData">
          <ElFormItem label="允许作答">
            <el-switch
              v-model="surveyData.status"
              style="--el-switch-on-color: #13ce66"
              active-value="1"
              inactive-value="0"
            />
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
        <ElForm v-if="!!questionData" label-position="top">
          <ElFormItem label="题目类型">
            <ElSelect
              :model-value="questionTypeValue"
              @update:model-value="handleUpdateQuestionTypeValue"
              placeholder="题目类型"
            >
              <ElOption
                v-for="(item, index) in QuestionTypeObj"
                :key="index"
                :label="item?.name"
                :value="index"
              />
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
  ElSelect,
  ElMessageBox
} from "element-plus";
import { computed, inject, watch, type Ref, ref, watchEffect } from "vue";
import {
  QuestionTypeEnum,
  QuestionTypeObj,
  getDefaultContent
} from "@/constants";
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

const questionTypeValue = ref();

watchEffect(() => {
  questionTypeValue.value = questionData.value?.type;
});

function handleUpdateQuestionTypeValue(val: QuestionTypeEnum | undefined) {
  ElMessageBox.confirm(
    "更改题目类型可能导致丢失部分信息，确认要修改吗？",
    "提示",
    {
      type: "warning",
      cancelButtonText: "取消",
      confirmButtonText: "确认"
    }
  )
    .then(() => {
      questionTypeValue.value = val;
    })
    .catch(() => {});
}

watch(questionTypeValue, (newVal, oldVal) => {
  questionData.value!.type = newVal as QuestionTypeEnum;
  const arr = [QuestionTypeEnum.MultiRadio, QuestionTypeEnum.Radio];
  if (
    arr.includes(newVal as QuestionTypeEnum) &&
    arr.includes(oldVal as QuestionTypeEnum)
  ) {
    return;
  } else {
    questionData.value!.content = getDefaultContent(newVal as QuestionTypeEnum);
  }
});
</script>

<style lang="scss" scoped>
.right-setting-box {
  z-index: 3;
  .el-card__body {
    height: 100%;
    padding: 20px 0;
  }
}
</style>
