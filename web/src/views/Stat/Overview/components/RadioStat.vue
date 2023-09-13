<template>
  <div class="radiostat">
    <p class="radiostat-title">
      <span style="font-weight: bold;">{{ props.listIndex+1 }}.</span>
      {{ props.statData.questionTitle }}
    </p>
    <p class="radiostat-info">
      填写率 {{ props.statData.answerRate }}% / 填写
      {{ props.statData.answerResultList.length }}
    </p>
    <PercentBar
      v-for="item in props.statData.options"
      :key="item.id"
      :name="item.text"
      :count="item.count"
      :rate="item.rate"
    ></PercentBar>
    <ChartSet :stat-data="props.statData"></ChartSet>
  </div>
</template>

<script setup lang="ts">
import PercentBar from "./PercentBar.vue";
import ChartSet from "./ChartSet.vue";

const props = defineProps({
  statData: {
    type: Object,
    required: true
  },
  listIndex: {
    type: Number,
    required: true,
  }
});
</script>

<style lang="scss" scoped>
.radiostat{
  margin: 70px 0;
}
.radiostat-title {
  padding: 5px 0;
}
.radiostat-info {
  color: #999999;
  font-size: 0.8rem;
  padding: 5px 0;
}
</style>
