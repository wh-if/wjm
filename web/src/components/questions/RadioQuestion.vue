<template>
  <ElRadioGroup
    v-model="radioValue"
    :disabled="reviewFlag"
    style="width: 100%; font-size: inherit"
  >
    <div class="options-box">
      <div
        v-for="item in props.questionContent.options"
        :key="item.id"
        class="option-item"
      >
        <ElRadio
          :model-value="false"
          :label="item.id"
          class="option-radio"
          :disabled="props.edit"
        >
          {{ props.edit ? "" : item.text }}
        </ElRadio>
        <EditInput
          v-if="props.edit"
          class="option-text"
          v-model="item.text"
          placeholder="请输入选项内容"
          :edit="props.edit"
        ></EditInput>
      </div>
    </div>
  </ElRadioGroup>
</template>

<script setup lang="ts">
import { ElRadio, ElRadioGroup } from "element-plus";
import EditInput from "../EditInput.vue";
import { ref, watch } from "vue";
import type { QuestionProps, RadioAnswer, RadioContent } from "./types";

const props = defineProps<QuestionProps<RadioContent, RadioAnswer>>();

const reviewFlag = props.answerValue !== undefined;
const emit = defineEmits(["update:answerValue", "focus"]);

const radioValue = ref(props.answerValue as number);

watch(radioValue, (val) => {
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
