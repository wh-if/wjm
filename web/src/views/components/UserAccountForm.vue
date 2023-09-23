<template>
  <ElForm ref="formRef" :model="inputState" :rules="formRules">
    <ElFormItem prop="email">
      <ElInput
        v-model="inputState.email"
        :prefix-icon="UserFilled"
        type="email"
        size="large"
        placeholder="邮箱"
        :disabled="$props.type == 'password'"
      />
    </ElFormItem>
    <ElFormItem prop="password">
      <ElInput
        v-model="inputState.password"
        type="password"
        :prefix-icon="Lock"
        size="large"
        placeholder="请输入密码"
      />
    </ElFormItem>
    <ElFormItem prop="checkPassword">
      <ElInput
        v-model="inputState.checkPassword"
        type="password"
        :prefix-icon="Lock"
        size="large"
        placeholder="请确认密码"
      />
    </ElFormItem>
    <ElFormItem prop="vcode">
      <div style="display: flex; width: 100%">
        <ElInput
          v-model="inputState.vcode"
          :prefix-icon="Lock"
          style="flex: 1"
          size="large"
          placeholder="输入验证码"
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
      <ElButton
        style="width: 300px; margin: 0 auto"
        @click="handleSubmit"
        type="primary"
        size="large"
      >
        提交
      </ElButton>
    </ElFormItem>
  </ElForm>
</template>

<script setup lang="ts">
import {
  ElForm,
  ElFormItem,
  ElMessage,
  ElInput,
  ElCountdown,
  ElButton
} from "element-plus";
import { Lock, UserFilled } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";
import { reactive, ref } from "vue";
import { getVerifyData, register, updatePassword } from "@/api/user";

const props = defineProps<{
  type: "register" | "password";
  close: () => void;
}>();

const userStore = useUserStore();
const formRef = ref();

const inputState = reactive({
  email: props.type == "password" ? userStore.user.email : "",
  password: "",
  checkPassword: "",
  vcode: ""
});

// 验证码倒计时
const verifyCodeState = reactive({
  countDown: Date.now() + 1000 * 60,
  hasSend: false
});

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

function handleSubmit() {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      let params = {
        email: inputState.email,
        password: inputState.password,
        vcode: inputState.vcode
      };
      if (props.type == "register") {
        register(params).then(() => {
          ElMessage.success("注册成功！");
          inputState.vcode = "";
          props.close();
        });
      } else if (props.type == "password") {
        updatePassword(params).then(({ message, data }) => {
          if (data) {
            ElMessage.success("修改成功！");
            props.close();
          } else {
            ElMessage.warning(message);
            inputState.vcode = "";
          }
        });
      }
    }
  });
}

const formRules = {
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
  ],
  checkPassword: [
    {
      trigger: "change",
      validator: (rule: any, value: any, callback: any) => {
        if (value === "") {
          callback(new Error("请输入邮箱"));
        } else if (inputState.password !== inputState.checkPassword) {
          callback(new Error("两次密码输入不一致，请重新输入。"));
        } else {
          callback();
        }
      }
    }
  ]
};
</script>

<style lang="scss" scoped></style>
