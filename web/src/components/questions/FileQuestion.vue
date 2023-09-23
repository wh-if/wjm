<template>
  <div>
    <ElUpload
      v-if="!props.disabled || props.edit"
      v-model:file-list="fileList"
      drag
      multiple
      :auto-upload="false"
      :disabled="props.disabled"
    >
      <ElIcon class="el-icon--upload"><UploadFilled /></ElIcon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template>
    </ElUpload>
    <div v-else>
      <p v-for="item in props.answerValue" :key="item.filename">
        <!-- <ElImage :src="item" ></ElImage> -->
        <ElLink @click="handleDownload(item.filename, item.mimetype)">{{
          item.originalFilename
        }}</ElLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ElIcon,
  ElLink,
  ElUpload,
  type UploadUserFile
} from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { uploadFile, getFile } from "@/api/file";
import type { FileContent, FileAnswer, QuestionProps } from "./types";
import { ref, watch } from "vue";

const props = defineProps<QuestionProps<FileContent, FileAnswer>>();
const emit = defineEmits(["update:answerValue"]);

const fileList = ref<UploadUserFile[]>([]);

function handleDownload(filename: string, mimetype: string) {
  getFile(filename, mimetype).then((file) => {
    const url = URL.createObjectURL(file as unknown as Blob);

    const tempLink = document.createElement("a");
    tempLink.style.display = "none";
    tempLink.href = url;
    tempLink.setAttribute("download", filename);
    if (typeof tempLink.download === "undefined") {
      tempLink.setAttribute("target", "_blank");
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(url);
  });
}

function handleUploadFile() {
  Promise.all(
    fileList.value.map((item) => {
      const formData = new FormData();
      formData.append("file", item.raw as File);
      return new Promise((resolve) => {
        uploadFile(formData).then(({ data }) => {
          resolve(data);
        });
      });
    })
  ).then((values) => {
    emit("update:answerValue", values);
  });
}

watch(fileList, () => {
  // console.log(fileList.value);
  handleUploadFile();
});
</script>

<style lang="scss" scoped></style>
