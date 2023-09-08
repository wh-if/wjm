<template>
  <div class="share-box">
    <div class="share-method__item">
      <p class="share-method__item-info">链接分享</p>
      <div class="share-method__item-link">
        https://wj.qq.com/s2/13033962/96ed/
      </div>
      <div>
        <ElLink :underline="false" >打开</ElLink>
        <ElDivider direction="vertical" style="margin: 0 50px"></ElDivider>
        <ElLink :underline="false">复制</ElLink>
      </div>
    </div>
    <div class="share-method__item">
      <p class="share-method__item-info">二维码分享</p>
      <div>
        <img width="120" height="120" src="@/assets/get_qrcode.png" />
      </div>

      <div>
        <ElLink :underline="false">下载</ElLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElCard, ElDivider, ElImage, ElLink } from "element-plus";
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
