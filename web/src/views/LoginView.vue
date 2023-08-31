ElMenuItem
<template>
  <div class="fullpage-main"></div>
  <ElCard class="form-box">
    <ElMenu mode="horizontal">
      <ElMenuItem>账号登录</ElMenuItem>
      <ElMenuItem>验证码登录</ElMenuItem>
    </ElMenu>
    <ElForm>
      <ElFormItem>
        <ElInput v-model="inputState.email" size="large" placeholder="邮箱" />
      </ElFormItem>
      <ElFormItem>
        <ElInput
          v-model="inputState.password"
          type="password"
          size="large"
          :placeholder="activeTab === 0 ? '密码' : '验证码'"
        />
      </ElFormItem>
      <ElFormItem>
        <ElButton
          @click="handleLogin"
          type="primary"
          size="large"
          style="width: 100%"
        >
          登录
        </ElButton>
      </ElFormItem>
    </ElForm>
  </ElCard>
</template>

<script setup lang="ts">
import { login } from "@/api/user";
import {
  ElCard,
  ElInput,
  ElButton,
  ElForm,
  ElFormItem,
  ElMenu,
  ElMenuItem,
  ElMessage
} from "element-plus";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const inputState = reactive({
  email: "",
  password: "" // 密码或验证码
});

const activeTab = ref<0 | 1>(0);

const router = useRouter();

function handleLogin() {
  login({
    email: inputState.email,
    password: inputState.password
  }).then(({ message }) => {
    ElMessage.success(message);
    router.replace("mine");
  });
}
</script>

<style lang="scss" scoped>
.fullpage-main {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background-image: url("@/assets/bacg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}

.form-box {
  z-index: 2;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 480px;
  padding: 20px 30px;
}
</style>
