<template>
  <div
    :id="$props.index.toString()"
    @click="handleClickQuestion"
    class="radio-question"
  >
    <div>
      <ElTag>单选</ElTag>
    </div>
    <h2 class="question-title">
      <span v-if="questionData.required" class="question-required-tag">*</span>
      <span style="margin-right: 15px">{{ index + 1 }}</span>
      <EditInput
        style="flex: 1"
        v-model="questionData.title"
        placeholder="请输入题目标题"
        :edit="props.edit"
      ></EditInput>
    </h2>
    <div class="question-description">
      <EditInput
        v-model="questionData.description"
        placeholder="请输入题目说明（选填）"
        :edit="props.edit"
      ></EditInput>
    </div>

    <RadioQuestion
      :question-content="questionData.content as RadioContent"
      :edit="props.edit"
      v-model:answer-value="answerValue"
    ></RadioQuestion>
  </div>
</template>

<script setup lang='ts'>
import { ElTag } from "element-plus";
import EditInput from "../EditInput.vue";
import { ref, watch, reactive, type PropType } from "vue";
import { updateQuestion, type Question } from "@/api/question";
import RadioQuestion from "./RadioQuestion.vue";
import { useAutoSave } from "@/hooks/useAutoSave";
import type { RadioContent } from "./types";

export interface AnswerData {
  questionId: number;
  resultValue: any;
}

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  edit: {
    type: Boolean,
    defalut: false
  },
  questionData: {
    type: Object as PropType<Question>,
    required: true
  },
  answerData: {
    type: Object as PropType<AnswerData>
  }
});

const emit = defineEmits(["answer-change", "focus"]);
const { addSaveItem } = useAutoSave();

const questionData = reactive<Question>(props.questionData);
const answerValue = ref<any>(props.answerData?.resultValue);

watch(answerValue, (val) => {
  emit("answer-change", {
    index: props.index,
    data: {
      questionId: questionData.id,
      resultValue: val
    }
  });
});

function handleClickQuestion() {
  emit("focus", { index: props.index });
}

const saveKey = Symbol("question");
watch(questionData, (newVal) => {
  addSaveItem(saveKey, () => updateQuestion(newVal));
});
</script>

<style lang="scss" scoped>
.question-title {
  display: flex;
  align-items: center;
  position: relative;
  .question-required-tag {
    position: absolute;
    left: -15px;
    color: red;
  }
}
.question-title,
.question-description {
  padding: 6px;
}
</style>
