<template>
  <ElContainer>
    <ElAside>
      <div style="text-align: center">
        <ElButton type="primary" size="large" style="width: 80%"
          >新建问卷</ElButton
        >
      </div>

      <ElMenu>
        <ElMenuItem>全部</ElMenuItem>
        <ElMenuItem>重要</ElMenuItem>
        <ElMenuItem>回收站</ElMenuItem>
      </ElMenu>
    </ElAside>
    <ElMain>
      <div class="tool-bar">
        <ElInput style="width: 300px" size="large" placeholder="输入问卷标题" />
        <div class="right">
          <ElSelect size="large"></ElSelect>
        </div>
      </div>
      <ElTable :data="state.questionnaireList" height="600" size="large">
        <ElTableColumn label="问卷ID" prop="id"></ElTableColumn>
        <ElTableColumn label="标题" prop="title"></ElTableColumn>
        <ElTableColumn label="创建时间" prop="createTime"></ElTableColumn>
        <ElTableColumn label="答卷数量" prop="answerCount"></ElTableColumn>
        <ElTableColumn label="状态" prop="status"></ElTableColumn>
      </ElTable>
      <ElPagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="1000"
      />
    </ElMain>
  </ElContainer>
</template>

<script setup lang="ts">
import { getSurveyList } from "@/api/survey";
import {
  ElAside,
  ElButton,
  ElContainer,
  ElInput,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElPagination,
  ElSelect,
  ElTable,
  ElTableColumn
} from "element-plus";
import { shallowReactive } from "vue";

const state = shallowReactive({
  questionnaireList: [] as Array<Record<string, any>>
});

function getData() {
  getSurveyList({ keyword: "", orderBy: "answerCount"}).then(({ data }) => {
    state.questionnaireList = data as Record<string, any>[];
  });
}
getData();
</script>

<style lang="scss" scoped>
.tool-bar {
  display: flex;
  padding: 10px 5px 20px;

  .right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
}
.pagination {
  margin-top: 30px;
  justify-content: right;
}
</style>
@/api/survey
