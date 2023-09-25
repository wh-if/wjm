<template>
  <div class="sort-question">
    <div v-if="props.disabled && !props.edit">
      <p
        v-for="(item, index) in props.answerValue"
        style="padding: 8px"
        :key="item"
      >
        <ElButton plain circle type="primary">{{ index + 1 }}</ElButton>
        <span style="margin-left: 10px">{{
          questionContent.options.find((i) => i.id == item)?.text
        }}</span>
      </p>
    </div>
    <Draggable
      v-else
      v-model="questionContent.options"
      item-key="id"
      class="sort-source-box"
    >
      <template #item="{ element: item, index }">
        <div class="sort-source-item">
          <div class="move-iconbutton">
            <ElIcon :size="16">
              <Sort></Sort>
            </ElIcon>
          </div>
          <ElButton plain circle type="primary">{{ index + 1 }}</ElButton>
          <EditInput
            :edit="props.edit"
            style="flex: 1"
            v-model="item.text"
          ></EditInput>
          <div
            v-if="props.edit"
            @click="
              () => {
                questionContent.options.splice(index, 1);
              }
            "
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
        () => questionContent.options.push({ id: Date.now(), text: '选项' })
      "
      text
      class="option-add"
      >添加选项</ElButton
    >
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElIcon } from "element-plus";
import EditInput from "../EditInput.vue";
import { ref, toRaw, watch } from "vue";
import type { QuestionProps, SortContent, SortAnswer } from "./types";
import Draggable from "vuedraggable-es";
import { Close, Sort } from "@element-plus/icons-vue";
import { deepClone } from "@/utils";

const props = defineProps<QuestionProps<SortContent, SortAnswer>>();
const emit = defineEmits(["update:answerValue", "update:question-content"]);

const questionContent = ref(deepClone(props.questionContent));

watch(
  questionContent,
  (val) => {
    if (props.edit) {
      emit("update:question-content", val);
    } else if (!props.disabled) {
      emit(
        "update:answerValue",
        val.options.map((i) => i.id)
      );
    }
  },
  {
    deep: true
  }
);
</script>

<style lang="scss" scoped>
.sort-question {
  border: 1px dashed rgb(180, 180, 180);
  border-radius: 6px;
  padding: 10px;
  width: fit-content;
  min-width: 300px;

  &:hover {
    border: 1px dashed rgb(86, 172, 248);
  }
  .sort-source-box {
    width: 300px;
    .sort-source-item {
      padding: 0 20px;
      display: flex;
      align-items: center;
      .move-iconbutton {
        margin-right: 10px;
      }

      .delete-iconbutton {
        opacity: 0;
        margin-left: 10px;
        cursor: pointer;
      }

      &:hover .delete-iconbutton {
        opacity: 1;
      }

      &:hover {
        background-color: rgb(239, 239, 239);
      }
    }
  }
}
.option-add {
  width: 100%;
  padding: 10px 0;
}
</style>
