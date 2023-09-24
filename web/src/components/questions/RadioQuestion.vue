<template>
  <ElRadioGroup
    v-model="radioValue"
    :disabled="props.disabled"
    style="width: 100%"
  >
    <div class="options-box">
      <!-- <div
        v-for="item in props.questionContent.options"
        :key="item.id"
        class="option-item"
      >
        <ElRadio :model-value="false" :label="item.id" class="option-radio">
          {{ props.edit ? "" : item.text }}
        </ElRadio>
        <EditInput
          v-if="props.edit"
          class="option-text"
          v-model="item.text"
          placeholder="请输入选项内容"
        ></EditInput>
      </div> -->
      <Draggable
        v-model="questionContent.options"
        :move="props.edit ? undefined : () => false"
        item-key="id"
      >
        <template #item="{ element: item, index }">
          <div class="option-item">
            <div v-if="props.edit" class="move-iconbutton">
              <ElIcon :size="16">
                <Sort></Sort>
              </ElIcon>
            </div>
            <ElRadio :model-value="false" :label="item.id" class="option-radio">
              {{ props.edit ? "" : item.text }}
            </ElRadio>
            <EditInput
              v-if="props.edit"
              class="option-text"
              v-model="item.text"
              placeholder="请输入选项内容"
            ></EditInput>
            <div
              v-if="props.edit"
              @click="() => questionContent.options.splice(index, 1)"
              class="delete-iconbutton"
            >
              <ElIcon title="删除" :size="16">
                <Close></Close>
              </ElIcon>
            </div>
          </div>
        </template>
      </Draggable>
      <ElButton
        v-if="props.edit"
        @click="
          () => questionContent.options.push({ id: Date.now(), text: '' })
        "
        text
        class="option-add"
        >添加选项</ElButton
      >
    </div>
  </ElRadioGroup>
</template>

<script setup lang="ts">
import { ElRadio, ElRadioGroup, ElButton, ElIcon } from "element-plus";
import EditInput from "../EditInput.vue";
import { reactive, ref, watch } from "vue";
import type { QuestionProps, RadioAnswer, RadioContent } from "./types";
import Draggable from "vuedraggable-es";
import { Close, Sort } from "@element-plus/icons-vue";

const props = defineProps<QuestionProps<RadioContent, RadioAnswer>>();
const emit = defineEmits(["update:answerValue", "update:question-content"]);

const questionContent = reactive(props.questionContent);

const radioValue = ref(props.answerValue as number);

watch(radioValue, (val) => {
  emit("update:answerValue", val);
});
watch(questionContent, (val) => {
  emit("update:question-content", val);
});
</script>

<style lang="scss" scoped>
.options-box {
  width: 100%;
  .option-item {
    display: flex;
    align-items: center;

    .move-iconbutton {
      opacity: 0;
      margin-right: 10px;
    }

    &:hover .move-iconbutton {
      opacity: 1;
    }

    .option-radio {
      margin: 0;
    }
    .option-text {
      flex: 1;
    }
    .delete-iconbutton {
      opacity: 0;
      margin-left: 10px;
      cursor: pointer;
    }

    &:hover .delete-iconbutton {
      opacity: 1;
    }
  }
  .option-add {
    width: 100%;
    margin: 10px auto;
  }
}
</style>
