<template>
  <MatrixTable
    v-model:options="questionContent.options"
    v-model:series="questionContent.series"
    :edit="props.edit"
  >
    <template #item="{ rowData, columnData }">
      <ElCheckbox
        v-model="answerValue[rowData.id][columnData.id]"
        :label="columnData.id.toString()"
        :disabled="props.disabled"
      >
        {{ "" }}
      </ElCheckbox>
    </template>
  </MatrixTable>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import MatrixTable from "./MatrixTable.vue";
import { ElCheckbox } from "element-plus";
import type {
  MatrixMultiRadioAnswer,
  MatrixMultiRadioContent,
  QuestionProps
} from "./types";

const props =
  defineProps<QuestionProps<MatrixMultiRadioContent, MatrixMultiRadioAnswer>>();

const questionContent = reactive(props.questionContent);
const emit = defineEmits(["update:answerValue", "update:question-content"]);

const answerValue = ref<MatrixMultiRadioAnswer>({});

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
    initAnswerValues();
  },
  {
    deep: true
  }
);

initAnswerValues();
function initAnswerValues() {
  if (props.answerValue) {
    answerValue.value = props.answerValue;
  }
  questionContent.series.forEach((item) => {
    if (!answerValue.value[item.id]) {
      answerValue.value[item.id] = {};
    }
  });
}
</script>

<style lang="scss" scoped></style>
