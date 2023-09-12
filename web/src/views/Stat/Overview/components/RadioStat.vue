<template>
  <div class="radiostat">
    <p class="radiostat-title">{{ "题目标题" }}</p>
    <p class="radiostat-info">填写率 100.0% / 填写 2</p>
    <PercentBar name="jack" :count="1" :rate="0.89"></PercentBar>
    <ChartSet></ChartSet>
  </div>
</template>

<script setup lang="ts">
import PercentBar from "./PercentBar.vue";
import ChartSet from "./ChartSet.vue";
</script>

<style lang="scss" scoped>

.radiostat-title{
  padding: 5px 0;
}
.radiostat-info{
  color: #999999;
  font-size: 0.8rem;
  padding: 5px 0;
}
</style>
