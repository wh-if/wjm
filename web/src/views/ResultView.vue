<template>
  <ElResult
    class="full-screen"
    icon="success"
    title="问卷到此结束，感谢您的参与！"
  ></ElResult>
</template>

<script setup lang="ts">
import { ElResult } from "element-plus";
</script>

<style lang="scss" scoped>
.full-screen {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
