<template>
  <div class="percentbar">
    <div class="percentbar-bg">
      <span class="percentbar-name">{{ props.name }}</span>
      <span class="percentbar-count">{{ props.count }}</span>

      <span class="percentbar-rate">{{ props.rate * 100 }}%</span>
    </div>
    <div class="percentbar-result" :style="{ width: `${props.rate * 100}%` }">
      <div
        class="percentbar-result-data"
        :style="{ width: `${100 / props.rate}%` }"
      >
        <span class="percentbar-name">{{ props.name }}</span>
        <span class="percentbar-count">{{ props.count }}</span>

        <span class="percentbar-rate">{{ props.rate * 100 }}%</span>
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
    color: white;
    position: absolute;
    top: 0;
    overflow: hidden;
  }
  .percentbar-name {
    width: 70%;
  }
  .percentbar-count {
    width: 10%;
  }
  .percentbar-rate {
    width: 10%;
  }
}
</style>
