<template>
  <div class="share-box">
    <div class="share-method__item">
      <p class="share-method__item-info">链接分享</p>
      <div class="share-method__item-link">
        {{ linkUrl }}
      </div>
      <div>
        <ElLink :underline="false" :href="linkUrl">打开</ElLink>
        <ElDivider direction="vertical" style="margin: 0 50px"></ElDivider>
        <ElLink :underline="false" @click="handleCopy">复制</ElLink>
      </div>
    </div>
    <div class="share-method__item">
      <p class="share-method__item-info">二维码分享</p>
      <div>
        <img width="120" height="120" :src="qrcodeImg" />
      </div>

      <div>
        <ElLink :underline="false" download :href="qrcodeImg">下载</ElLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElDivider, ElLink, ElMessage } from "element-plus";
import { computed, ref } from "vue";
import { useClipboard } from "@/hooks/useClipboard";
import QRCode from "qrcode";

const props = defineProps({
  surveyId: {
    type: Number,
    required: true
  }
});

const { copy, copied } = useClipboard();

const linkUrl = computed(() => location.origin + "/s/" + props.surveyId);

const qrcodeImg = ref();

function generateQRCode() {
  QRCode.toDataURL(linkUrl.value)
    .then((url: string) => {
      qrcodeImg.value = url;
    })
    .catch((err: any) => {
      console.error(err);
    });
}
generateQRCode();

function handleCopy() {
  copy(linkUrl.value).then(() => {
    if (copied.value) {
      ElMessage.success("复制成功！");
    }
  });
}
</script>

<style lang="scss" scoped>
.share-box {
  display: flex;
}

.share-method__item {
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  width: 100%;
}
.share-method__item-info {
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  color: #999999;
}
.share-method__item-link {
  padding: 5px 8px;
  background: #f3f3f3;
  border-radius: 6px;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #999999;
  word-break: break-all;
  text-align: left;
}
</style>
