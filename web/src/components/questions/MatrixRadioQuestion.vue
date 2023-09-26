<template>
  <MatrixTable
    type="radio"
    v-model:options="questionContent.options"
    v-model:series="questionContent.series"
    :edit="props.edit"
    :disabled="props.disabled"
    v-model:values="answerValue"
  ></MatrixTable>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import MatrixTable from "./MatrixTable.vue";
import type {
  MatrixRadioAnswer,
  MatrixRadioContent,
  QuestionProps
} from "./types";

const props =
  defineProps<QuestionProps<MatrixRadioContent, MatrixRadioAnswer>>();

const questionContent = reactive(props.questionContent);
const emit = defineEmits(["update:answerValue", "update:question-content"]);

const answerValue = ref(getInitValues());

watch(
  answerValue,
  (val) => {
    emit("update:answerValue", val);
  },
  {
    deep: true
  }
);
watch(
  questionContent,
  (val) => {
    emit("update:question-content", val);
  },
  {
    deep: true
  }
);
function getInitValues() {
  if (props.answerValue) {
    return props.answerValue as MatrixRadioAnswer;
  }
  let obj = {} as MatrixRadioAnswer;
  return obj;
}
</script>

<style lang="scss" scoped></style>
