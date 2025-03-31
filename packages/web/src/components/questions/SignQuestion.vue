<template>
  <div class="sign-question">
    <div v-if="props.edit" class="sign-placeholder">
      <ElIcon :size="20">
        <Edit></Edit>
      </ElIcon>
      <p>请在此处签名</p>
    </div>
    <template v-if="!props.disabled">
      <vueEsign ref="esignRef"></vueEsign>
      <div class="sign-tool-bar">
        <ElButton @click="handleResetSign">重新签名</ElButton>
        <ElButton type="primary" @click="handleSaveSign">保存</ElButton>
      </div>
    </template>
    <ElImage
      v-if="props.disabled && !props.edit"
      :src="props.answerValue"
    ></ElImage>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElIcon, ElImage, ElMessage } from "element-plus";
import { Edit } from "@element-plus/icons-vue";
import { ref } from "vue";
import vueEsign from "vue-esign";
import type { QuestionProps, SignAnswer, SignContent } from "./types";

const props = defineProps<QuestionProps<SignContent, SignAnswer>>();

const esignRef = ref();

const emit = defineEmits(["update:answerValue"]);

function handleResetSign() {
  esignRef.value.reset();
}
function handleSaveSign() {
  esignRef.value
    .generate()
    .then((res: string) => {
      emit("update:answerValue", res);
      ElMessage.success("保存成功！");
    })
    .catch(() => {
      ElMessage.warning("请先签名。");
    });
}
</script>

<style lang="scss">
.sign-question {
  border: 1px dashed rgb(180, 180, 180);
  border-radius: 6px;
  padding: 10px;

  &:hover {
    border: 1px dashed rgb(86, 172, 248);
  }
}
.sign-placeholder {
  width: 100%;
  height: 150px;
  text-align: center;
  padding-top: 50px;
  opacity: 0.4;
}
.sign-tool-bar {
  text-align: right;
  padding-top: 10px;
}
</style>
