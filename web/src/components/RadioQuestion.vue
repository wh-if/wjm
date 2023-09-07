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
    <!-- <ElRadioGroup v-model="value"> -->
    <div class="options-box">
      <div
        v-for="item in questionData.content.options"
        :key="item.id"
        class="option-item"
      >
        <ElRadio :model-value="false" class="option-radio" disabled> </ElRadio>
        <EditInput class="option-text" v-model="item.text"></EditInput>
      </div>
    </div>
  </div>

  <!-- </ElRadioGroup> -->
</template>

<script setup lang="ts">
import { ElTag, ElRadio, ElRadioGroup } from "element-plus";
import EditInput from "./EditInput.vue";
import { inject, ref, watch, type Ref } from "vue";
import type { SurveyWithQuestions } from "@/api/survey";
import { updateQuestion } from "@/api/question";

const props = defineProps({
  questionId: Number,
  listIndex: {
    type: Number,
    required: true
  }
});
const questionData =
  inject<Ref<SurveyWithQuestions>>("surveyData")?.value.quesitons[
    props.listIndex
  ]!;
const activeQuestionIndex = inject<Ref<number>>("activeQuestionIndex");

  // 给右侧面板用
function handleClickQuestion() {
  activeQuestionIndex!.value = props.listIndex;
}

watch(questionData, (newVal) => {
  updateQuestion(newVal);
})

// 修改后的保存
</script>

<style lang="scss" scoped>
.question-title {
  display: flex;
  align-items: center;
  padding-top: 12px;
}

.question-description {
  margin: 10px 0;
}
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
</style>
