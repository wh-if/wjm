import { ref, watch } from "vue";
const defaultTheme =
  (document.documentElement.getAttribute("class") ||
    sessionStorage.getItem("theme")) === "dark";
export function useDark() {
  const darkState = ref(defaultTheme);

  watch(
    darkState,
    (val) => {
      const str = val ? "dark" : "light";
      document.documentElement.setAttribute("class", val ? "dark" : "light");
      sessionStorage.setItem("theme", str);
    },
    { immediate: true }
  );

  return {
    darkState
  };
}
