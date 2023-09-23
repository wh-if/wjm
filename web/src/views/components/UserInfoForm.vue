<template>
  <ElForm label-width="80">
    <ElFormItem label="用户ID" prop="id">
      <ElInput :model-value="userStore.user.id" disabled></ElInput>
    </ElFormItem>

    <ElFormItem label="邮箱" prop="email">
      <ElInput :model-value="userStore.user.email" disabled></ElInput>
    </ElFormItem>

    <ElFormItem prop="name" label="用户名称">
      <ElInput v-model="username"></ElInput>
    </ElFormItem>
    <ElFormItem v-show="showButton">
      <ElButton type="primary" @click="submitUpdate">确认修改</ElButton>
    </ElFormItem>
  </ElForm>
</template>

<script setup lang="ts">
import { ElButton, ElForm, ElFormItem, ElInput, ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import { ref, watch } from "vue";
import { updateUserData } from "@/api/user";

const userStore = useUserStore();
const props = defineProps<{
  close: () => void;
}>();

const username = ref(userStore.user.name);

const showButton = ref(false);

watch(username, (newVal, oldVal) => {
  if (newVal.length == 0) {
    showButton.value = false;
    ElMessage.error("用户名不能为空！");
  } else if (newVal != oldVal) {
    showButton.value = true;
  } else {
    showButton.value = false;
  }
});

function submitUpdate() {
  updateUserData({
    name: username.value
  }).then(() => {
    userStore.$patch({
      user: {
        name: username.value
      }
    });
    ElMessage.success("修改成功！");
    props.close();
  });
}
</script>

<style lang="scss" scoped></style>
