import { ElLoading } from "element-plus";
import { ref } from "vue";

export function useLoading() {
  const loading = ref(true);
  const instance = ElLoading.service({
    fullscreen: true,
    lock: true
  });
  function close() {
    instance.close();
    loading.value = false;
  }
  return {
    loading,
    close
  }
  
}