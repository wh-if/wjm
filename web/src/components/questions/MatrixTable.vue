<template>
  <div class="matrix-table-container">
    <table class="matrix-table">
      <thead>
        <Draggable
          :move="handleDragMove"
          v-model="state.options"
          tag="tr"
          item-key="id"
          :disabled="!props.edit"
        >
          <template #item="{ element, index }">
            <th>
              <div class="option-item">
                <div v-if="index != 0 && props.edit" class="move-iconbutton">
                  <ElIcon :size="16">
                    <Sort></Sort>
                  </ElIcon>
                </div>
                <EditInput
                  v-if="index > 0"
                  :edit="props.edit"
                  v-model="element.text"
                ></EditInput>
                <div
                  v-if="index != 0 && props.edit"
                  @click="() => state.options.splice(index, 1)"
                  class="delete-iconbutton"
                >
                  <ElIcon title="删除" :size="16">
                    <Close></Close>
                  </ElIcon>
                </div>
              </div>
            </th>
          </template>
        </Draggable>
      </thead>

      <Draggable
        v-model="state.series"
        :move="handleDragMove"
        tag="tbody"
        :item-key="(e: any) => e"
        :disabled="!props.edit"
      >
        <template #item="{ element, index }">
          <tr>
            <td>
              <div class="option-item">
                <div v-if="props.edit" class="move-iconbutton">
                  <ElIcon :size="16">
                    <Sort></Sort>
                  </ElIcon>
                </div>
                <EditInput
                  :edit="props.edit"
                  v-model="element.name"
                ></EditInput>
                <div
                  v-if="props.edit"
                  @click="() => state.series.splice(index, 1)"
                  class="delete-iconbutton"
                >
                  <ElIcon title="删除" :size="16">
                    <Close></Close>
                  </ElIcon>
                </div>
              </div>
            </td>
            <td v-for="item in state.options.length - 1" :key="item">
              <slot
                name="item"
                :columnData="state.options[item]"
                :rowData="element"
              ></slot>
            </td>
          </tr>
        </template>
      </Draggable>
    </table>
    <div class="matrix-table-btns">
      <ElButton
        v-if="props.edit"
        @click="handleAdd"
        text
        type="primary"
        class="series-add"
        >添加行</ElButton
      >
      <ElButton
        v-if="props.edit"
        @click="() => state.options.push({ id: Date.now(), text: '选项名称' })"
        text
        type="primary"
        class="option-add"
        >添加选项</ElButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElIcon } from "element-plus";
import { reactive, toRaw, watch } from "vue";
import Draggable from "vuedraggable-es";
import EditInput from "../EditInput.vue";

const props = defineProps<{
  options: {
    id: number;
    text: string;
  }[];
  series: {
    id: number;
    name: string;
  }[];
  edit: boolean;
}>();

const state = reactive({
  options: [{ id: -1 }, ...props.options],
  series: [...props.series]
});

const emit = defineEmits(["update:options", "update:series", "update:values"]);

function handleDragMove(evt: any) {
  if (!props.edit) {
    return false;
  }
  const draggedElement = evt.dragged.__draggable_context.element;
  const relatedElement = evt.related.__draggable_context.element;
  if (draggedElement.id == -1 || relatedElement.id == -1) {
    return false;
  }
  return true;
}

function handleAdd() {
  const key = Date.now();
  const name = "行标题";
  state.series.push({
    id: key,
    name
  });
}

watch(
  () => state.options,
  (val) => {
    emit(
      "update:options",
      val.slice(1).map((item) => toRaw(item))
    );
  },
  {
    deep: true
  }
);
watch(
  () => state.series,
  (val) => {
    emit("update:series", val);
  },
  {
    deep: true
  }
);
</script>

<style lang="scss" scoped>
.matrix-table {
  width: 100%;
  text-align: center;
  margin-top: 10px;
  .option-item {
    display: flex;
    align-items: center;
    justify-content: center;

    .move-iconbutton {
      opacity: 0;
      margin-right: 10px;
    }

    &:hover .move-iconbutton {
      opacity: 1;
    }

    .delete-iconbutton {
      opacity: 0;
      margin-left: 10px;
      cursor: pointer;
    }

    &:hover .delete-iconbutton {
      opacity: 1;
    }
  }
}

.matrix-table-btns {
  display: flex;
  justify-content: right;

  margin-top: 10px;
}
</style>
