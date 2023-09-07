<template>
  <div class="nav-main">
    <ElSteps simple :active="1" style="width: 620px;background-color: transparent;">
      <ElStep title="编辑" status="process"></ElStep>
      <ElStep title="设置" status="process"></ElStep>
      <ElStep title="分享" status="process"></ElStep>
      <ElStep title="统计" status="process"></ElStep>
    </ElSteps>
  </div>
</template>

<script setup lang="ts">
import { ElSteps, ElStep } from "element-plus";
</script>

<style lang="scss" scoped>
.nav-main{
  display: flex;
  justify-content: center;

  background-color: #fff;
  z-index: 99;
}
</style>
