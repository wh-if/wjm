<template>
  <ElCard class="right-setting-box">
    <ElTabs>
      <ElTabPane label="题目设置">
        <ElForm>
          <ElFormItem>
            <ElSelect placeholder="题目类型">
              <ElOption :label="'单选'" :value="'radio'" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem>
            
            <ElCheckbox label="必答题" size="large" />
          </ElFormItem>
        </ElForm>
        <!-- <div style="overflow-y: auto; height: 100%">
          
        </div> -->
      </ElTabPane>
    </ElTabs>
  </ElCard>
</template>

<script setup lang="ts">
import {
  ElCard,
  ElCheckbox,
  ElForm,
  ElFormItem,
  ElOption,
  ElTabs
} from "element-plus";
import { inject } from "vue";
</script>

<style lang="scss" scoped>
.right-setting-box {
  .el-card__body {
    height: 100%;
    padding: 20px 0;
  }
}
</style>
