<template>
  <div :class="['question-card', isEdit ? 'question-card-activity' : '']">
    <div class="question-card-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";

const isEdit = inject<boolean>("isEdit");
</script>

<style lang="scss" scoped>
.question-card {
  background-color: #fff;
  padding: 12px 0;

  .question-card-body {
    width: 80%;
    margin: 0 auto;
  }
}
.question-card-activity {
  transition: transform 100ms linear;
  &:hover {
    transform: scale(1.01);
    transform-origin: center;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.07);
    border-radius: 8px;
  }
}
</style>
