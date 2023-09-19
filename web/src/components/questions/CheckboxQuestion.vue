<template>
  <ElCheckboxGroup
    v-model="inputValue"
    :disabled="props.disabled || props.edit"
  >
    <div class="options-box">
      <div
        v-for="item in props.questionContent.options"
        :key="item.id"
        class="option-item"
      >
        <ElCheckbox :label="item.id">
          {{ props.edit ? "" : item.text }}
        </ElCheckbox>
        <EditInput
          v-if="props.edit"
          class="option-text"
          v-model="item.text"
          placeholder="请输入选项内容"
        >
        </EditInput>
      </div>
    </div>
  </ElCheckboxGroup>
</template>

<script setup lang="ts">
import { ElCheckbox, ElCheckboxGroup } from "element-plus";
import { ref, watch } from "vue";
import type { CheckboxAnswer, CheckboxContent, QuestionProps } from "./types";
import EditInput from "../EditInput.vue";

const props = defineProps<QuestionProps<CheckboxContent, CheckboxAnswer>>();

const emit = defineEmits(["update:answerValue"]);

const inputValue = ref(props.answerValue);

watch(inputValue, (val) => {
  emit("update:answerValue", val);
});
</script>

<style lang="scss" scoped>
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
