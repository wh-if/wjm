<template>
  <div
    :class="isEdit ? 'editable-box' : ''"
    v-show="showFlag"
    :style="{}"
    @input="handleInput"
    @keydown="handleKeyDown"
    @focus="handleFocus"
    @blur="handleBlur"
    :contenteditable="isEdit"
  >
    <p
      :style="
        props.modelValue?.length > 0
          ? props.textBoxStyle
          : [props.textBoxStyle, { color: 'gray' }]
      "
      v-html="inputValue"
    ></p>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType, type StyleValue, inject, computed } from "vue";
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: "请输入"
  },
  textBoxStyle: {
    type: Object as PropType<StyleValue>,
    default: () => ({ padding: "8px" })
  }
});
const isEdit = inject<boolean>("isEdit");
const showFlag = computed(() => isEdit || props.modelValue !== "");
const inputValue = ref(props.modelValue || props.placeholder);

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.preventDefault();
  }

  // emit("update:modelValue", props.modelValue + "</br>");
}

function handleFocus() {
  if (props.modelValue === "") {
    inputValue.value = "<br/>";
  }
}

function handleBlur() {
  if (props.modelValue === "") {
    inputValue.value = props.placeholder;
  }
}

const emit = defineEmits(["update:modelValue"]);

function handleInput(e: Event) {
  // console.log(e);

  if (e.target) {
    // if (props.modelValue === "") {
    // console.log((e as InputEvent).data);
    // inputValue.value = (e as InputEvent).data as string;
    //   emit("update:modelValue", (e as InputEvent).data);
    // } else {
    // console.log((e.target as HTMLInputElement).textContent);
    emit("update:modelValue", (e.target as HTMLInputElement).textContent);
    // }
  }
}
</script>

<style lang="scss" scoped>
.editable-box {
  border: 1px solid transparent;
  & :hover {
    border: 1px dashed rgb(64, 160, 220);
  }
}
</style>
