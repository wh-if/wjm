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
import { refreshToken } from "./user";

type AjaxResult<T> = {
  message: string;
  /**
   * 0 成功
   * 1 失败
   * 2 token 失效
   *  */
  code: 0 | 1 | 2;
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
    const { token, refresh_token } = userStore.user;
    if (token) {
      config.headers.token = token;
      config.headers.refresh_token = refresh_token;
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
    service<any, AxiosResponse<AjaxResult<T>>>(config).then(
      async (response) => {
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
          } else if (code === 2) {
            const refreshResponse = (await handleRefresh(
              response
            )) as AxiosResponse;
            resolve(refreshResponse.data as AjaxResult<T>);
          } else {
            resolve(response.data);
          }
        } else {
          ElMessage.warning(response.statusText);
          reject(response);
        }
      }
    );
  });
};
export { service, request };

let isRefreshToken = false;
function handleRefresh(response: AxiosResponse) {
  if (!isRefreshToken) {
    isRefreshToken = true;
    refreshToken().then(({ data }) => {
      const userStore = useUserStore();
      userStore.$patch({
        user: {
          token: data.token,
          refresh_token: data.refresh_token
        }
      });
      isRefreshToken = false;
      //发布 消息
      retryOldRequest.trigger(data.token);
    });
  }
  //收集订阅者 并把成功后的数据返回原接口
  return retryOldRequest.listen(response);
}

const retryOldRequest = {
  //维护失败请求的response
  requestQuery: [] as any[],

  //添加订阅者
  listen(response: AxiosResponse) {
    return new Promise((resolve) => {
      this.requestQuery.push((newToken: any) => {
        const config = response.config || {};
        config.headers["Authorization"] = newToken;
        resolve(service(config));
      });
    });
  },

  //发布消息
  trigger(newToken: string) {
    this.requestQuery.forEach((fn: any) => {
      fn(newToken);
    });
    this.requestQuery = [];
  }
};
