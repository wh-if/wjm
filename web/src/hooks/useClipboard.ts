import { computed, ref, type Ref } from "vue";


export interface UseClipboardOptions {
  /**
   * Milliseconds to reset state of `copied` ref
   *
   * @default 1500
   */
  copiedDuring?: number;

  /**
   * Whether fallback to document.execCommand('copy') if clipboard is undefined.
   *
   * @default false
   */
  legacy?: boolean;
}

export interface UseClipboardReturn {
  isSupported: Ref<boolean>;
  text: Ref<string>;
  copied: Ref<boolean>;
  copy: (text?: string) => Promise<void>;
}

export function useClipboard(
  options: UseClipboardOptions = {}
): UseClipboardReturn {
  const { copiedDuring = 1500, legacy = false } = options;

  const isClipboardApiSupported = navigator && "clipboard" in navigator;
  const isSupported = computed(() => isClipboardApiSupported || legacy);
  const text = ref("");
  const copied = ref(false);

  async function copy(value: string | undefined) {
    if (isSupported.value && value != null) {
      if (isClipboardApiSupported)
        await navigator!.clipboard.writeText(value);
      else legacyCopy(value);

      text.value = value;
      copied.value = true;
      setTimeout(() => (copied.value = false), copiedDuring);
    }
  }

  function legacyCopy(value: string) {
    const ta = document.createElement("textarea");
    ta.value = value ?? "";
    ta.style.position = "absolute";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }

  return {
    isSupported,
    text: text,
    copied: copied,
    copy
  };
}
