<template>
  <div :class="['question-card-container', isAnswer ? 'reactive' : '']">
    <div :class="['question-card', isEdit ? 'question-card-activity' : '']">
      <div class="question-card-body">
        <slot />
      </div>
    </div>
    <ElCard
      v-if="isEdit && props.tool"
      class="question-card-tool"
      body-style="padding: 8px;"
    >
      <div class="tool-btns">
        <!-- <ElButton
          :icon="Plus"
          @click="emit('prev-add')"
          circle
          size="small"
        ></ElButton> -->
        <ElButton
          :type="$props.stared ? 'warning' : 'default'"
          :icon="Star"
          title="收藏"
          @click="emit('star')"
          circle
          size="small"
        >
        </ElButton>
        <ElButton
          :icon="CopyDocument"
          @click="emit('copy')"
          title="复制"
          circle
          size="small"
        ></ElButton>
        <!-- <ElButton :icon="Rank" circle size="small"></ElButton> -->
        <ElButton
          :icon="Delete"
          @click="emit('delete')"
          title="删除"
          circle
          size="small"
        ></ElButton>

        <!-- <ElButton
          :icon="Plus"
          @click="emit('next-add')"
          circle
          size="small"
        ></ElButton> -->
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { ElButton, ElCard, ElIcon } from "element-plus";
import {
  CopyDocument,
  Delete,
  Plus,
  Rank,
  Star
} from "@element-plus/icons-vue";

const props = defineProps({
  tool: {
    type: Boolean,
    default: true
  },
  stared: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["prev-add", "star", "copy", "delete", "next-add"]);

const route = useRoute();

const isEdit = computed(() => route.name === "edit");
const isAnswer = computed(() => route.name === "answer");
</script>

<style lang="scss" scoped>
.question-card-container {
  position: relative;
  padding: 0 64px;
  margin: 20px 0;

  .question-card-tool {
    position: absolute;
    top: 50%;
    right: 0;
    width: 0;
    height: 0;
    transition: none;
    .tool-btns {
      * {
        margin: 10px 0;
        display: block;
      }
    }
  }

  &:hover .question-card-tool {
    width: fit-content;
    height: fit-content;
    transform: translateY(-50%);
  }
  &:hover .question-card-activity {
    cursor: move;
    transition: transform 150ms linear;
    transform: scale(1.02);
    transform-origin: center;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.07);
    border-radius: 8px;
  }
}
.question-card {
  background-color: var(--el-bg-color-overlay);
  padding: 30px 0;

  .question-card-body {
    width: 86%;
    margin: 0 auto;
    height: 100%;
  }
}
@media (max-width: 860px) {
  .reactive {
    .question-card {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .question-card-body {
      padding: 64px 0;
    }
  }
}
</style>
