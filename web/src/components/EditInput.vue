<template>
  <div
    :class="props.edit ? 'editable-box' : ''"
    v-show="showFlag"
    :style="{}"
    @input="handleInput"
    @keydown="handleKeyDown"
    @focus="handleFocus"
    @blur="handleBlur"
    :contenteditable="props.edit"
  >
    <p
      :style="
        props.modelValue?.length! > 0
          ? props.textBoxStyle
          : [props.textBoxStyle, { color: 'gray' }]
      "
      v-html="inputValue"
    ></p>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType, type StyleValue, computed } from "vue";
const props = defineProps({
  modelValue: {
    type: String,
    // required: true,
    default: ""
  },
  placeholder: {
    type: String,
    default: "请输入"
  },
  textBoxStyle: {
    type: Object as PropType<StyleValue>,
    default: () => ({ padding: "8px" })
  },
  edit: {
    type: Boolean,
    default: false
  }
});
const showFlag = computed(() => props.edit || props.modelValue !== "");
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
  if (e.target) {
    emit("update:modelValue", (e.target as HTMLInputElement).textContent);
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
