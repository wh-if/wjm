<template>
  <MatrixTable
    v-model:options="questionContent.options"
    v-model:series="questionContent.series"
    :edit="props.edit"
  >
    <template #item="{ rowData, columnData }">
      <ElRadio
        v-model="answerValue[rowData.id]"
        :label="columnData.id.toString()"
        :disabled="props.disabled"
      >
        {{ "" }}
      </ElRadio>
    </template>
  </MatrixTable>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { ElRadio } from "element-plus";
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

const answerValue = ref<MatrixRadioAnswer>(props.answerValue || {});

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
</script>

<style lang="scss" scoped></style>
