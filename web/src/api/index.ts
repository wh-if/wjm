import router from "@/router";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import type {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig
} from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

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

const request = <T = Record<string, any>>(config: AxiosRequestConfig) => {
  return new Promise<AjaxResult<T>>((resolve, reject) => {
    service(config).then((response) => {
      if (response.status === 200) {
        const { code, message } = response.data;
        if (code === 1) {
          ElMessageBox.confirm(message, "提示", {
            showCancelButton: false,
            confirmButtonText: "确认"
          })
            .then(() => {
              router.push("/login");
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
