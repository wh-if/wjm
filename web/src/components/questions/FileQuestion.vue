<template>
  <div class="file-qeustion-container">
    <ElUpload
      v-if="!props.disabled || props.edit"
      v-model:file-list="fileList"
      drag
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :auto-upload="false"
      list-type="picture"
      :disabled="props.disabled"
    >
      <ElIcon class="el-icon--upload"><UploadFilled /></ElIcon>
      <div class="el-upload__text">拖动文件到此处或<em>点击上传</em></div>
      <!-- <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template> -->
    </ElUpload>
    <div class="answer-list" v-else>
      <p v-for="item in props.answerValue" :key="item.filename">
        <ElLink @click="handleDownload(item)">{{ item.filename }}</ElLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ElIcon,
  ElLink,
  ElMessage,
  ElTag,
  ElUpload,
  type UploadProps,
  type UploadUserFile
} from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import {
  uploadFile,
  getFile,
  uploadFileShard,
  checkFileShard,
  mergeFileShard
} from "@/api/file";
import type { FileContent, FileAnswer, QuestionProps } from "./types";
import { reactive, ref, watch } from "vue";
import { cryptoDigest } from "@/utils/crypto";

const props = defineProps<QuestionProps<FileContent, FileAnswer>>();
const emit = defineEmits(["update:answerValue"]);

const fileList = ref<UploadUserFile[]>([]);

const uploadConfig = reactive({
  shardSize: 1 * 1024 * 1024 // 1M
});

function handleDownload(fileItem: FileAnswer[0]) {
  getFile(
    fileItem.fileKey + "." + fileItem.filename.split(".")[1],
    fileItem.mimetype
  ).then((file) => {
    const url = URL.createObjectURL(file as unknown as Blob);

    const tempLink = document.createElement("a");
    tempLink.style.display = "none";
    tempLink.href = url;
    tempLink.setAttribute("download", fileItem.filename);
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
    fileList.value.map(async (item) => {
      const itemRaw = item.raw;
      if (!itemRaw) {
        return;
      }

      const fileKey = await cryptoDigest(
        itemRaw!.name + itemRaw!.size + itemRaw?.type + itemRaw?.lastModified
      );
      await handleShardUpload(fileKey, itemRaw);
      return {
        mimetype: item.raw?.type,
        filename: item.name,
        fileKey
      };
    })
  ).then((values) => {
    ElMessage.success("上传成功！");
    emit("update:answerValue", values);
  });
}

async function handleShardUpload(fileKey: string, itemRaw: File) {
  const fileSuffix = itemRaw.name.split(".")[1];
  const shardTotalCount = Math.ceil(itemRaw.size / uploadConfig.shardSize);
  const {
    data: { uploadedShard, fullUploaded }
  } = await checkFileShard({
    fileKey,
    shardTotalCount,
    fileSuffix
  });

  if (fullUploaded) {
    return;
  }

  let uploadPromiseArray = [];
  for (let i = 0; i < shardTotalCount; i++) {
    // 跳过已经上传过的分片
    if (uploadedShard.includes(i.toString())) {
      continue;
    }
    const start = i * uploadConfig.shardSize;
    const end = Math.min(itemRaw.size, start + uploadConfig.shardSize);
    const formData = new FormData();
    formData.append("file", (itemRaw as File).slice(start, end));
    formData.append("fileKey", fileKey);
    formData.append("shardIndex", i.toString());
    uploadPromiseArray.push(uploadFileShard(formData));
  }
  await Promise.all(uploadPromiseArray);

  await mergeFileShard({
    fileKey,
    shardTotalCount,
    fileSuffix
  });
}

const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(
    `最多选择3个文件，您选择了${files.length}个文件，请重新选择。`
  );
};

watch(fileList, () => {
  // console.log(fileList.value);
  handleUploadFile();
});
</script>

<style lang="scss" scoped>
.file-qeustion-container {
  .answer-list {
    padding: 6px 20px;
  }
}
</style>
