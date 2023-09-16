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

    <EditInput
      class="question-description"
      v-model="questionData.description"
      placeholder="请输入题目说明（选填）"
      :edit="props.edit"
    ></EditInput>

    <ElRadioGroup
      v-model="radioValue"
      :disabled="reviewFlag"
      style="width: 100%; font-size: inherit"
    >
      <div class="options-box">
        <div
          v-for="item in questionData.content.options"
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
  </div>
</template>

<script setup lang="ts">
import { ElTag, ElRadio, ElRadioGroup } from "element-plus";
import EditInput from "./EditInput.vue";
import { ref, watch, reactive, type PropType, computed } from "vue";
import { updateQuestion, type Question } from "@/api/question";

export type RadioAnswerType = {
  questionId: number;
  resultValue: string | number;
};

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
    type: Object as PropType<RadioAnswerType>
  }
});

const reviewFlag = props.answerData !== undefined;
const emit = defineEmits(["answer-change", "focus"]);

const questionData = reactive<Question>(props.questionData);

const radioValue = ref(props.answerData?.resultValue);

watch(radioValue, (val) => {
  emit("answer-change", {
    index: props.index,
    data: {
      questionId: questionData.id,
      resultValue: val
    }
  });
});

// 给右侧面板用
function handleClickQuestion() {
  emit("focus", { index: props.index });
}

watch(questionData, (newVal) => {
  updateQuestion(newVal);
});
</script>

<style lang="scss" scoped>
.question-title {
  display: flex;
  align-items: center;
  padding-top: 12px;
  position: relative;
  .question-required-tag {
    position: absolute;
    left: -15px;
    color: red;
  }
}

.question-description {
  margin: 10px 0;
}

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
