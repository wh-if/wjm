import { ElNotification } from "element-plus";
import { ref } from "vue";
// TODO 页面跳转时的处理
const hasSaved = ref(true);
let timer = 0;
const fnMap = new Map<Symbol, () => Promise<any>>();

export function useAutoSave() {
  function addSaveItem(key: Symbol, fn: () => Promise<any>) {
    fnMap.set(key, fn);
    hasSaved.value = false;
    if (timer) clearTimeout(timer);
    timer = setTimeout(saveAll, 5000);
  }
  // 全部保存
  function saveAll() {
    const promises: Promise<any>[] = [];
    fnMap.forEach((valueFn) => promises.push(valueFn()));
    Promise.all(promises).then(() => {
      clearTimeout(timer);
      fnMap.clear();
      hasSaved.value = true;
      ElNotification.success({
        message: "保存成功！",
        duration: 1500
      });
    });
  }

  return {
    hasSaved,
    saveAll,
    addSaveItem
  };
}
