ElMenuItem
<template>
  <div class="fullpage-main"></div>
  <ElCard class="form-box">
    <div class="logo">
      <img src="@/assets/image/ghost.png" alt="问卷猫" />
      <h1>问卷猫</h1>
    </div>

    <ElForm ref="formRef" :model="inputState" :rules="formRules">
      <ElFormItem prop="email">
        <ElInput
          v-model="inputState.email"
          :prefix-icon="UserFilled"
          type="email"
          size="large"
          placeholder="邮箱"
        />
      </ElFormItem>
      <ElFormItem v-if="isPasswordType" prop="password">
        <ElInput
          v-model="inputState.password"
          type="password"
          :prefix-icon="Lock"
          size="large"
          :placeholder="isPasswordType ? '密码' : '验证码'"
        />
      </ElFormItem>
      <ElFormItem v-if="!isPasswordType" prop="vcode">
        <div style="display: flex; width: 100%">
          <ElInput
            v-model="inputState.vcode"
            :prefix-icon="Lock"
            style="flex: 1"
            size="large"
            :placeholder="isPasswordType ? '密码' : '验证码'"
          />
          <ElButton
            @click="sendVerifyCode"
            type="success"
            :disabled="verifyCodeState.hasSend"
            style="margin-left: 10px"
            size="large"
          >
            <span v-if="!verifyCodeState.hasSend"> 发送验证码 </span>

            <span v-else>
              <ElCountdown
                :value="verifyCodeState.countDown"
                :value-style="{ fontSize: '0.9rem', color: 'white' }"
                format="ss"
                @finish="verifyCodeState.hasSend = false"
              />
              秒后重新发送
            </span>
          </ElButton>
        </div>
      </ElFormItem>
      <ElFormItem>
        <div class="checkbox-box">
          <div>
            <ElCheckbox v-show="isPasswordType" label="记住密码" />
          </div>

          <div>
            <ElLink @click="visible = true" :underline="false">注册账号</ElLink>
          </div>
        </div>
      </ElFormItem>
      <ElFormItem>
        <ElButton
          style="width: 100%"
          @click="handleLogin"
          type="primary"
          size="large"
        >
          登录
        </ElButton>
      </ElFormItem>
      <ElFormItem>
        <ElButton
          style="width: 100%"
          @click="isPasswordType = !isPasswordType"
          type="default"
          plain
          size="large"
        >
          使用{{ isPasswordType ? "验证码" : "密码" }}登录
        </ElButton>
      </ElFormItem>
    </ElForm>
  </ElCard>
  <ElDialog v-model="visible" title="注册" destroy-on-close width="520px">
    <UserAccountForm
      type="register"
      :close="() => (visible = false)"
    ></UserAccountForm>
  </ElDialog>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { Lock, UserFilled } from "@element-plus/icons-vue";
import {
  ElCard,
  ElInput,
  ElButton,
  ElForm,
  ElFormItem,
  ElLink,
  ElCheckbox,
  ElDivider,
  type FormRules,
  ElMessage,
  ElCountdown
} from "element-plus";
import { reactive, ref } from "vue";
import { type LoginParams, getVerifyData } from "@/api/user";
import UserAccountForm from "./components/UserAccountForm.vue";

const isPasswordType = ref<boolean>(true);

const inputState = reactive({
  email: "",
  password: "", // 密码或验证码
  vcode: ""
});

const visible = ref(false);

// 验证码倒计时
const verifyCodeState = reactive({
  countDown: Date.now() + 1000 * 60,
  hasSend: false
});

const userStore = useUserStore();

const formRef = ref();

const formRules: FormRules<typeof inputState> = {
  email: [
    {
      trigger: "blur",
      validator: (rule: any, value: any, callback: any) => {
        if (value === "") {
          callback(new Error("请输入邮箱"));
        } else {
          callback();
        }
      }
    }
  ],
  password: [
    {
      trigger: "blur",
      validator: (rule: any, value: any, callback: any) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else {
          callback();
        }
      }
    }
  ],
  vcode: [
    {
      trigger: "blur",
      validator: (rule: any, value: any, callback: any) => {
        if (value === "") {
          callback(new Error("请输入验证码"));
        } else {
          callback();
        }
      }
    }
  ]
};

// 发送验证码
function sendVerifyCode() {
  if (verifyCodeState.hasSend) {
    return;
  }
  if (inputState.email == "") {
    ElMessage.warning("请先输入邮箱地址！");
  } else {
    getVerifyData(inputState.email).then(() => {
      verifyCodeState.countDown = Date.now() + 60 * 1000;
      verifyCodeState.hasSend = true;
    });
  }
}

function handleLogin() {
  formRef.value!.validate((valid: boolean) => {
    if (valid) {
      const loginParams: LoginParams = {
        email: inputState.email
      };
      if (isPasswordType.value) {
        loginParams.password = inputState.password;
      } else {
        loginParams.vcode = inputState.vcode;
      }
      userStore.loginAction(loginParams);
      inputState.password = "";
      inputState.vcode = "";
    }
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
  background-image: url("@/assets/image/bacg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}

.logo {
  text-align: center;
  margin-bottom: 20px;
  img {
    width: 60px;
  }
  h1 {
    font-size: 1.2rem;
    font-weight: bolder;
    letter-spacing: 2px;
  }
}

.form-box {
  z-index: 2;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 460px;
  padding: 20px 30px 0;
  .checkbox-box {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .bottom-btns {
    display: flex;
    width: 100%;
  }
}
</style>
