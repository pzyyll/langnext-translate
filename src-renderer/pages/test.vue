<template>
  <div class="container">
    <h1>Vue 3 原生拖拽看板</h1>
    <div class="board">
      <!-- 待办事项列 -->
      <div
        class="column"
        id="todo-column"
        :class="{ 'drag-over': isDraggingOver === 'todo' }"
        @dragover.prevent
        @dragenter="handleDragEnter('todo')"
        @dragleave="handleDragLeave"
        @drop="handleDrop('todo')"
      >
        <h2>待办事项</h2>
        <div
          v-for="task in todoTasks"
          :key="task.id"
          class="task"
          :class="{ 'is-dragging': draggedTaskId === task.id }"
          draggable="true"
          @dragstart="handleDragStart(task, 'todo')"
          @dragend="handleDragEnd"
        >
          {{ task.text }}
        </div>
        <p v-if="!todoTasks.length" class="empty-state">拖拽任务到这里</p>
      </div>

      <!-- 已完成列 -->
      <div
        class="column"
        id="done-column"
        :class="{ 'drag-over': isDraggingOver === 'done' }"
        @dragover.prevent
        @dragenter="handleDragEnter('done')"
        @dragleave="handleDragLeave"
        @drop="handleDrop('done')"
      >
        <h2>已完成</h2>
        <div
          v-for="task in doneTasks"
          :key="task.id"
          class="task"
          :class="{ 'is-dragging': draggedTaskId === task.id }"
          draggable="true"
          @dragstart="handleDragStart(task, 'done')"
          @dragend="handleDragEnd"
        >
          {{ task.text }}
        </div>
         <p v-if="!doneTasks.length" class="empty-state">拖拽任务到这里</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// --- 响应式状态 ---
// 使用 ref 来创建响应式数据，当这些数据变化时，Vue 会自动更新 DOM

// 任务列表
const todoTasks = ref([
  { id: 1, text: '任务一：学习 Vue 3 响应式系统' },
  { id: 2, text: '任务二：掌握 Composition API' },
  { id: 3, text: '任务三：构建一个拖拽组件' },
]);
const doneTasks = ref([]);

// 拖拽过程中的状态
const draggedItem = ref(null);      // 存储被拖拽的任务对象
const sourceList = ref(null);       // 存储任务来源列表的名称 ('todo' 或 'done')
const draggedTaskId = ref(null);    // 存储被拖拽任务的 ID，用于动态添加 class
const isDraggingOver = ref(null);   // 存储当前拖拽悬停的列名

// --- 事件处理函数 ---

/**
 * 当拖拽开始时触发
 * @param {object} task - 被拖拽的任务对象
 * @param {string} from - 任务来源列表的名称
 */
function handleDragStart(task, from) {
  // Vue 的优势：可以直接传递对象引用，无需像原生JS那样依赖 dataTransfer 存储 id
  draggedItem.value = task;
  sourceList.value = from;
  draggedTaskId.value = task.id; // 用于视觉反馈

  // 注意：虽然我们不在此处使用 dataTransfer 传递数据，但设置它对于
  // 某些浏览器（如 Firefox）的拖拽兼容性以及与外部应用交互是必要的。
  // event.dataTransfer.setData('text/plain', task.id);
  // event.dataTransfer.effectAllowed = 'move';
}

/**
 * 当拖拽进入一个有效的放置目标时触发
 * @param {string} targetList - 目标列表的名称
 */
function handleDragEnter(targetList) {
  // 如果任务被拖到非原始列表的上方，则高亮显示
  if (sourceList.value !== targetList) {
    isDraggingOver.value = targetList;
  }
}

/**
 * 当拖拽离开一个有效的放置目标时触发
 */
function handleDragLeave() {
  isDraggingOver.value = null;
}

/**
 * 当任务被放置时触发
 * @param {string} toList - 任务被放置的目标列表名称
 */
function handleDrop(toList) {
  // 如果没有拖拽项，或者放置在原始列表中，则不执行任何操作
  if (!draggedItem.value || sourceList.value === toList) {
    isDraggingOver.value = null; // 即使是无效放置，也要清除高亮
    return;
  }

  // 1. 从源列表中移除任务
  if (sourceList.value === 'todo') {
    const index = todoTasks.value.findIndex(t => t.id === draggedItem.value.id);
    if (index !== -1) todoTasks.value.splice(index, 1);
  } else {
    const index = doneTasks.value.findIndex(t => t.id === draggedItem.value.id);
    if (index !== -1) doneTasks.value.splice(index, 1);
  }

  // 2. 将任务添加到目标列表
  if (toList === 'todo') {
    todoTasks.value.push(draggedItem.value);
  } else {
    doneTasks.value.push(draggedItem.value);
  }

  // 清理拖拽状态在 dragend 事件中处理
  isDraggingOver.value = null; // 清除放置目标的高亮
}


/**
 * 当拖拽操作结束时（无论成功与否）触发
 */
function handleDragEnd() {
  // 清理所有拖拽过程中的状态
  draggedItem.value = null;
  sourceList.value = null;
  draggedTaskId.value = null;
  isDraggingOver.value = null;
}
</script>

<style scoped>
/* 'scoped' 属性确保这些样式只应用于当前组件，不会泄露到全局 */
.container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

h1 {
    margin-bottom: 2rem;
}

.board {
    display: flex;
    gap: 20px;
    justify-content: center;
    padding: 20px;
    width: 100%;
    max-width: 800px;
}

.column {
    background-color: #e3e8ed;
    border-radius: 8px;
    padding: 15px;
    width: 300px;
    min-height: 400px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, border-color 0.3s ease;
}

.column h2 {
    margin-top: 0;
    padding-bottom: 10px;
    border-bottom: 2px solid #cdd5de;
}

.task {
    background-color: #ffffff;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 10px;
    cursor: grab;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    user-select: none;
}

.task:active {
    cursor: grabbing;
}

/* 关键视觉反馈：正在被拖拽的元素 */
.task.is-dragging {
    opacity: 0.5;
    background: #cde7ff;
    box-shadow: none;
    transform: scale(0.95);
}

/* 关键视觉反馈：有效的放置区域 */
.column.drag-over {
    border: 2px dashed #007bff;
    background-color: #f0f8ff;
}

.empty-state {
    color: #777;
    text-align: center;
    margin-top: 2rem;
    font-style: italic;
}
</style>
