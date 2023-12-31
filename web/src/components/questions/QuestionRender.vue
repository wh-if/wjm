<template>
  <div
    :id="$props.index.toString()"
    @click="handleClickQuestion"
    class="radio-question"
  >
    <div>
      <ElTag>{{ dynamicComponent!.name }}</ElTag>
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

    <component
      :is="dynamicComponent!.component"
      v-model:question-content="questionData.content"
      :edit="props.edit"
      :disabled="props.disabled"
      v-model:answer-value="answerValue"
    ></component>
  </div>
</template>

<script setup lang="ts">
import { ElTag } from "element-plus";
import EditInput from "../EditInput.vue";
import { ref, watch, reactive, type PropType, computed, inject } from "vue";
import { updateQuestion, type Question } from "@/api/question";
import { QuestionTypeObj } from "@/constants";
import { saveToolInjectionKey } from "@/constants/injectionKey";

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
  disabled: {
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
const saveTool = props.edit ? inject(saveToolInjectionKey) : undefined;

const questionData = reactive<Question>(props.questionData);
const answerValue = ref<any>(props.answerData?.resultValue);

const dynamicComponent = computed(() => QuestionTypeObj[questionData.type!]);

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
  saveTool?.addSaveItem(saveKey, () => updateQuestion(newVal));
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
