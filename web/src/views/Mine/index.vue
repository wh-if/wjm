<template>
  <ElContainer>
    <ElAside>
      <div style="text-align: center">
        <ElButton
          type="primary"
          @click="handleNewCreate"
          size="large"
          style="width: 80%"
        >
          新建问卷
        </ElButton>
      </div>

      <ElMenu>
        <ElMenuItem>全部</ElMenuItem>
        <ElMenuItem>重要</ElMenuItem>
        <ElMenuItem>回收站</ElMenuItem>
      </ElMenu>
    </ElAside>
    <ElMain>
      <div class="tool-bar">
        <ElInput
          v-model="state.searchInputValue"
          style="width: 300px"
          size="large"
          clearable
          placeholder="输入问卷标题"
        />
        <ElButton size="large" @click="getData">搜索</ElButton>
        <div class="right">
          <ElSelect @change="getData" v-model="state.searchOrderBy">
            <ElOption key="answerCount" label="答卷数量" value="answerCount" />
            <ElOption key="createTime" label="创建时间" value="createTime" />
          </ElSelect>
          <ElSelect @change="getData" v-model="state.searchDesc">
            <ElOption key="true" label="降序" :value="true" />
            <ElOption key="false" label="升序" :value="false" />
          </ElSelect>
        </div>
      </div>
      <ElTable :data="state.questionnaireList" height="600" size="large">
        <ElTableColumn label="问卷ID" prop="id"> </ElTableColumn>
        <ElTableColumn label="标题" prop="title"></ElTableColumn>
        <ElTableColumn label="创建时间" prop="createTime">
          <template #default="scope">
            {{ new Date(parseInt(scope.row.createTime)).toLocaleString() }}
          </template>
        </ElTableColumn>
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
import { getSurveyList, createNewSurvey } from "@/api/survey";
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
  ElTableColumn,
  ElOption
} from "element-plus";
import { shallowReactive } from "vue";
import { useRouter } from "vue-router";

const state = shallowReactive({
  questionnaireList: [] as Array<Record<string, any>>,
  searchInputValue: "",
  searchOrderBy: "createTime" as const,
  searchDesc: true
});

const router = useRouter();

function handleNewCreate() {
  createNewSurvey().then(({ data }) => {
    router.push(`/edit?surveyId=${data.surveyId}`);
  });
}

function getData() {
  getSurveyList({
    keyword: state.searchInputValue,
    orderBy: state.searchOrderBy,
    desc: state.searchDesc
  }).then(({ data }) => {
    state.questionnaireList = data.list;
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
    > * {
      margin: 0 10px;
      width: 120px;
    }
  }
}
.pagination {
  margin-top: 30px;
  justify-content: right;
}
</style>
@/api/survey
