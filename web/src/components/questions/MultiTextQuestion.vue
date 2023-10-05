<template>
  <div class="multi-text">
    <div class="multi-text-content">
      <template v-for="(item, index) in questionContent.textArray" :key="index">
        <span
          v-if="typeof item == 'string'"
          class="text-area"
          :contenteditable="props.edit"
          @input="(e) => handleContentInput(e, index)"
        >
          {{ item || "输入内容" }}
        </span>
        <span
          v-else
          :class="props.edit ? 'input-area' : ''"
          contenteditable="false"
          :style="{
            display: 'inline-block',
            width: props.edit ? '100px' : 'fit-content'
          }"
        >
          <ElInput
            v-model="answerObj[item]"
            :placeholder="props.edit ? '填空' : ''"
            :disabled="props.disabled"
          ></ElInput>
          <ElIcon
            v-if="props.edit"
            title="删除"
            @click="handleClickRemove(index)"
            :size="16"
          >
            <Close></Close>
          </ElIcon>
        </span>
      </template>
    </div>
    <ElButton v-if="props.edit" @click="handleAdd" text class="input-add"
      >添加输入框</ElButton
    >
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElInput, ElMessageBox, ElIcon } from "element-plus";
import { reactive, ref, watch } from "vue";
import type { MultiTextAnswer, MultiTextContent, QuestionProps } from "./types";
import type { Close } from "@element-plus/icons-vue";

const props = defineProps<QuestionProps<MultiTextContent, MultiTextAnswer>>();
const emit = defineEmits(["update:answerValue", "update:question-content"]);

const questionContent = reactive(props.questionContent);

const answerObj = ref(props.answerValue || {});

// 删除填空
function handleClickRemove(index: number) {
  ElMessageBox.confirm("确认要删除吗？", {
    type: "warning",
    confirmButtonText: "确定",
    cancelButtonText: "取消"
  })
    .then(() => {
      (questionContent.textArray[index - 1] as string) += questionContent
        .textArray[index + 1] as string;
      questionContent.textArray.splice(index, 2);
    })
    .catch(() => {});
}

function handleContentInput(e: any, index: number) {
  questionContent.textArray[index] = e.target.innerText;
}

function handleAdd() {
  questionContent.textArray.push(Date.now(), "");
}

watch(
  answerObj,
  (val) => {
    emit("update:answerValue", val);
  },
  {
    deep: true
  }
);
watch(questionContent, (val) => {
  emit("update:question-content", val);
});
</script>

<style lang="scss" scoped>
.multi-text-content {
  padding: 8px;
  border: 1px transparent;
  border: 1px dashed rgb(162, 162, 162);
  line-height: 32px;

  .text-area {
    padding: 6px 14px;
    outline: none;
    cursor: text;
  }
}
.input-area {
  padding-right: 30px;
  position: relative;
  .el-icon {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
  }
}
.input-add {
  width: 100%;
  margin: 10px 0;
}
</style>
