import { useUserStore } from "@/stores/user";
import axios from "axios";
import type {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig
} from "axios";
import { ElMessage } from "element-plus";

type AjaxResult = {
  message: string;
  code: 0 | 1;
  data: Record<string, any> | Array<Record<string, any>>;
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

const request = (config: AxiosRequestConfig) => {
  return new Promise<AjaxResult>((resolve, reject) => {
    service(config).then((response) => {
      if (response.status === 200) {
        resolve(response.data);
      } else {
        ElMessage.warning(response.statusText);
        reject(response);
      }
    });
  });
};
export { service, request };