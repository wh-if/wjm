import { reactive } from "vue";
import { defineStore } from "pinia";
import { login, logout } from "@/api/user";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

export const useUserStore = defineStore("user", () => {
  const user = reactive({
    id:"",
    name: "",
    email: "",
    token: ""
  });
  const router = useRouter();

  function loginAction(loginInfo: Record<string, any>) {
    login(loginInfo).then(({ data: { id,name, email, token }, message }) => {
      user.id = id
      user.name = name;
      user.email = email;
      user.token = token;
      ElMessage.success(message);
      router.replace("mine");
    });
  }

  function logoutAction() {
    logout().then(({ message }) => {
      user.id = "";
      user.name = "";
      user.email = "";
      user.token = "";
      ElMessage.success(message);
      router.replace("login");
    })
  }

  return { user, loginAction,logoutAction };
});
