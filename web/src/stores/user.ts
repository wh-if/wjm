import { reactive } from "vue";
import { defineStore } from "pinia";
import { login, logout, type LoginParams } from "@/api/user";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

export const useUserStore = defineStore("user", () => {
  const user = reactive({
    id: "",
    name: "",
    email: "",
    token: "",
    refresh_token: ""
  });
  const router = useRouter();

  function loginAction(loginInfo: LoginParams) {
    login(loginInfo).then(
      ({ data: { id, name, email, token, refresh_token }, message }) => {
        user.id = id;
        user.name = name;
        user.email = email;
        user.token = token;
        user.refresh_token = refresh_token;
        ElMessage.success(message);
        router.replace("mine");
      }
    );
  }

  function logoutAction() {
    logout().then(({ message }) => {
      user.id = "";
      user.name = "";
      user.email = "";
      user.token = "";
      user.refresh_token = "";
      ElMessage.success(message);
      router.replace("login");
    });
  }
  return { user, loginAction, logoutAction };
});
