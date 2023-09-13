<template>
  <div class="percentbar">
    <div class="percentbar-bg">
      <span class="percentbar-name">{{ props.name }}</span>
      <span class="percentbar-count">{{ props.count }}</span>

      <span class="percentbar-rate">{{ (props.rate * 100).toFixed(0) }}%</span>
    </div>
    <div class="percentbar-result" :style="{ width: `${props.rate * 100}%` }">
      <div
        class="percentbar-result-data"
        :style="{ width: `${100 / props.rate}%` }"
      >
        <span class="percentbar-name">{{ props.name }}</span>
        <span class="percentbar-count">{{ props.count }}</span>

        <span class="percentbar-rate">{{ (props.rate * 100).toFixed(0) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  rate: {
    type: Number,
    required: true
  }
});
</script>

<style lang="scss" scoped>
.percentbar {
  height: 40px;
  position: relative;
  border-radius: 6px;
  border: 1px solid #e1e7f2;
  margin: 10px 0;
  > * {
    height: 100%;
    line-height: 40px;
  }

  .percentbar-bg {
    width: 100%;
  }

  .percentbar-bg,
  .percentbar-result-data {
    display: flex;
    justify-content: space-around;
  }

  .percentbar-result {
    background-color: #008fff;
    border-radius: 4px;
    color: white;
    position: absolute;
    top: 0;
    overflow: hidden;
  }
  .percentbar-name {
    padding-left: 20px;
    width: 80%;
  }
  .percentbar-count {
    width: 8%;
  }
  .percentbar-rate {
    width: 8%;
  }
}
</style>
