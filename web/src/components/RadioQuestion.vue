<template>
  <div
    :id="$props.listIndex.toString()"
    @click="handleClickQuestion"
    class="radio-question"
  >
    <div>
      <ElTag>单选</ElTag>
    </div>
    <h2 class="question-title">
      <span v-if="questionData.required" class="question-required-tag">*</span>
      <span style="margin-right: 15px">{{ listIndex + 1 }}</span>
      <EditInput
        style="flex: 1"
        v-model="questionData.title"
        placeholder="请输入题目标题"
      ></EditInput>
    </h2>

    <EditInput
      class="question-description"
      v-model="questionData.description"
      placeholder="请输入题目说明（选填）"
    ></EditInput>

    <ElRadioGroup v-model="radioValue" style="width: 100%; font-size: inherit">
      <div class="options-box">
        <div
          v-for="item in questionData.content.options"
          :key="item.id"
          class="option-item"
        >
          <ElRadio
            :model-value="false"
            :label="item.id"
            class="option-radio"
            :disabled="isEdit"
          >
            {{ isEdit ? "" : item.text }}
          </ElRadio>
          <EditInput
            v-if="isEdit"
            class="option-text"
            v-model="item.text"
            placeholder="请输入选项内容"
          ></EditInput>
        </div>
      </div>
    </ElRadioGroup>
  </div>
</template>

<script setup lang="ts">
import { ElTag, ElRadio, ElRadioGroup } from "element-plus";
import EditInput from "./EditInput.vue";
import { inject, ref, watch, type Ref, reactive } from "vue";
import type { SurveyWithQuestions } from "@/api/survey";
import { updateQuestion } from "@/api/question";

const props = defineProps({
  listIndex: {
    type: Number,
    required: true
  }
});
// 问题内容
const questionData =
  inject<Ref<SurveyWithQuestions>>("surveyData")?.value.questions[
    props.listIndex
  ]!;

const isEdit = inject<boolean>("isEdit");
const activeQuestionIndex =
  isEdit && inject<Ref<number>>("activeQuestionIndex");
const questionAnswer =
  !isEdit && inject<Ref<Record<string, any>[]>>("questionAnswer");
const radioValue = ref();

watch(radioValue, (val) => {
  (questionAnswer as Ref<Record<string, any>[]>).value[props.listIndex] = {
    questionId: questionData.id,
    resultValue: val
  };
});

// 给右侧面板用
function handleClickQuestion() {
  if (isEdit) {
    (activeQuestionIndex as Ref<number>).value = props.listIndex;
  }
}

watch(questionData, (newVal) => {
  updateQuestion(newVal);
});

// 修改后的保存
</script>

<style lang="scss" scoped>
.question-title {
  display: flex;
  align-items: center;
  padding-top: 12px;
  position: relative;
  .question-required-tag {
    position: absolute;
    left: -15px;
    color: red;
  }
}

.question-description {
  margin: 10px 0;
}

.options-box {
  width: 100%;
  .option-item {
    display: flex;
    align-items: center;

    .option-radio {
      margin: 0;
    }
    .option-text {
      flex: 1;
    }
  }
}
</style>
