<template>
  <div
    class="editable-box"
    :style="{}"
    @input="handleChange"
    @keydown.enter="handle"
    contenteditable="true"
  >
    <p
      :style="
        props.modelValue?.length > 0
          ? props.textBoxStyle
          : [props.textBoxStyle, { color: 'gray' }]
      "
    >
      {{ props.modelValue || props.placeholder }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { type PropType, type StyleValue } from "vue";
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
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

function handle(e: Event) {
  e.preventDefault();
  // emit("update:modelValue", props.modelValue + "</br>");
}

const emit = defineEmits(["update:modelValue"]);

function handleChange(e: Event) {
  // console.log(e);

  if (e.target) {
    if (props.modelValue === "") {
      emit("update:modelValue", (e as InputEvent).data);      
      
    } else {
      emit("update:modelValue", (e.target as HTMLInputElement).textContent);
    }
  }
}
</script>

<style lang="scss" scoped>

.editable-box:hover {
  border: 1px dashed rgb(64, 160, 220);
}
</style>
