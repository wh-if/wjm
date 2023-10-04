<template>
  <div class="star-question">
    <div class="star-question-tips">
      <ElTag effect="dark" type="info" class="tips-left">{{
        props.questionContent.leftText
      }}</ElTag>
      <ElTag effect="dark" type="warning" class="tips-right">{{
        props.questionContent.rightText
      }}</ElTag>
    </div>
    <ElRate
      v-model="inputValue"
      :max="props.questionContent.countLength"
      size="large"
      :low-threshold="Math.floor(props.questionContent.countLength * 0.4)"
      :high-threshold="Math.floor(props.questionContent.countLength * 0.8)"
      :disabled="props.disabled"
      class="star-question-content"
    ></ElRate>
  </div>
</template>

<script setup lang="ts">
import { ElRate, ElTag } from "element-plus";
import type { QuestionProps, StarAnswer, StarContent } from "./types";
import { ref, watch } from "vue";

const props = defineProps<QuestionProps<StarContent, StarAnswer>>();
const emit = defineEmits(["update:answerValue"]);

const inputValue = ref(props.answerValue);

watch(inputValue, (val) => {
  emit("update:answerValue", val);
});
</script>

<style lang="scss" scoped>
.star-question {
  width: fit-content;
  min-width: 240px;
  padding: 14px;
  .star-question-tips {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
  }
  .star-question-content {
    height: auto;
    flex-wrap: wrap;
    width: 100%;
    --el-rate-icon-size: 24px;
  }
}
</style>
