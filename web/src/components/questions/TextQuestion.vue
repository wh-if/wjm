<template>
  <ElInput v-model="inputValue" :disabled="reviewFlag || props.edit"></ElInput>
</template>

<script setup lang="ts">
import { ElInput } from "element-plus";
import { ref, watch } from "vue";
import type { QuestionProps, TextAnswer, TextContent } from "./types";

const props = defineProps<QuestionProps<TextContent, TextAnswer>>();

const reviewFlag = props.answerValue !== undefined;
const emit = defineEmits(["update:answerValue"]);

const inputValue = ref(props.answerValue);

watch(inputValue, (val) => {
  emit("update:answerValue", val);
});
</script>

<style lang="scss" scoped></style>
