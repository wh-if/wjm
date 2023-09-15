import router from "@/router";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import type {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse
} from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

type AjaxResult<T> = {
  message: string;
  code: 0 | 1;
  data: T;
};
const service: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 5000
});

service.interceptors.request.use(
  (config) => {
    // const token = sessionStorage.getItem("token");
    const userStore = useUserStore();
    const token = userStore.user.token;
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error: AxiosError) => {
    // console.log(error);
    return Promise.reject();
  }
);

service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    ElMessage.error(error.message);
    console.log(error);
    return Promise.reject();
  }
);
let onlyOneMessage = false;
const request = <T = Record<string, any>>(config: AxiosRequestConfig) => {
  return new Promise<AjaxResult<T>>((resolve, reject) => {
    service<any, AxiosResponse<AjaxResult<T>>>(config).then((response) => {
      if (response.status === 200) {
        const { code, message } = response.data;
        if (code === 1) {
          if (onlyOneMessage) {
            return;
          }
          onlyOneMessage = true;
          ElMessageBox.confirm(message, "提示", {
            showCancelButton: false,
            confirmButtonText: "确认"
          })
            .then(() => {
              router.push("/login");
              onlyOneMessage = false;
              
            })
            .catch(() => {
              // router.back()
            });
        } else {
          resolve(response.data);
        }
      } else {
        ElMessage.warning(response.statusText);
        reject(response);
      }
    });
  });
};
export { service, request };
