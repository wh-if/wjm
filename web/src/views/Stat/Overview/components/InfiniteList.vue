<template>
  <ElCard shadow="never">
    <div v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
      <!-- <template>
        
      </template> -->
      <template v-for="(item, index) in computedList" :key="index">
        <!-- TODO -->
        <ElTag v-if="props.tag" :type="tagTypes[Math.floor(Math.random() * 4)]"
          >{{ item }}
        </ElTag>
        <p v-else class="infinite-list-item">{{ item }}</p>
      </template>
    </div>
  </ElCard>
</template>

<script setup lang="ts">
import { ElCard, ElTag } from "element-plus";
import { ref, type PropType, computed } from "vue";

const tagTypes = ["success", "danger", "warning", "info"];

const props = defineProps({
  list: {
    type: Object as PropType<any[]>,
    required: true
  },
  tag: {
    type: Boolean,
    default: true
  }
});
const count = ref(0);
const load = () => {
  if (count.value <= props.list.length - 5) {
    count.value += 5;
  } else {
    count.value = props.list.length;
  }
};

const computedList = computed(() => props.list.slice(0, count.value));
</script>

<style lang="scss" scoped>
.infinite-list {
  height: 400px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
.el-tag {
  margin: 10px 5px 0 5px;
}
</style>
