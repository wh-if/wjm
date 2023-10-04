<template>
  <ElFormItem label="两极文案">
    <ElInput
      placeholder="左极文案"
      v-model="state.leftText"
      style="margin: 5px"
    />
    <ElInput
      placeholder="右极文案"
      v-model="state.rightText"
      style="margin: 5px"
    />
  </ElFormItem>
  <ElFormItem label="量表维度">
    <ElInputNumber
      v-model="state.countLength"
      :precision="0"
      :step="1"
      :max="20"
    />
  </ElFormItem>
</template>

<script setup lang="ts">
import type { StarContent } from "@/components/questions/types";
import { ElFormItem, ElInput, ElInputNumber } from "element-plus";
import { reactive, watch } from "vue";

const props = defineProps<{ contentData?: Record<string, any> }>();
const emit = defineEmits(["update:contentData"]);

const state = reactive<StarContent>({
  leftText: props.contentData?.leftText || "",
  rightText: props.contentData?.rightText || "",
  countLength: props.contentData?.countLength || 5
});

watch(state, (val) => {
  emit("update:contentData", val);
});
</script>

<style lang="scss" scoped></style>
