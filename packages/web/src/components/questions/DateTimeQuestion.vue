<template>
  <ElDatePicker
    v-model="inputValue"
    type="datetime"
    :disabled="props.disabled"
    value-format="YYYY-MM-DD HH:mm:ss"
  ></ElDatePicker>
</template>

<script setup lang="ts">
import { ElDatePicker } from "element-plus";
import { ref, watch } from "vue";
import type { QuestionProps, DateTimeAnswer, DateTimeContent } from "./types";

const props = defineProps<QuestionProps<DateTimeContent, DateTimeAnswer>>();

const emit = defineEmits(["update:answerValue"]);

const inputValue = ref(props.answerValue);

watch(inputValue, (val) => {
  emit("update:answerValue", val);
});
</script>

<style lang="scss"></style>
