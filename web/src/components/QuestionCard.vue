<template>
  <div class="question-card">
    <div class="question-card-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.question-card {
  transition: transform 100ms linear;
  background-color: #fff;
  padding: 12px 0;

  &:hover {
    transform: scale(1.01);
    transform-origin: center;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.07);
    border-radius: 8px;
  }

  .question-card-body {
    width: 80%;
    margin: 0 auto;
  }
}
</style>
