<template>
  <v-card variant="flat">
    <v-card-title v-if="$slots.header">
      <slot name="header" />
    </v-card-title>
    <v-divider></v-divider>
    <v-container v-if="tasks.length">
      <v-row
        v-for="task in tasks"
        :key="task.key"
        class="align-center"
        no-gutters
        cols="12"
      >
        <v-col cols="1">
          <v-checkbox
            :model-value="task.isCompleted"
            @update:model-value="(value) => completeTask(task.key, value)"
            color="red"
            hide-details
          ></v-checkbox>
        </v-col>
        <v-col>
          <v-card @click="openTaskDetail(task.key)" class="pa-2" variant="text">
            <h3 :class="getTaskStyle(task.isCompleted)">
              {{ task.name }}
            </h3>
            <p :class="getDueDateColor(task.date)">
              {{ dateAdapter.format(task.date, 'shortDate') }}
            </p>
          </v-card>
        </v-col>
        <v-col cols="1">
          <v-btn
            @click="deleteTask(task.key, task.parentKey)"
            :icon="mdiTrashCan"
            color="error"
            density="compact"
            variant="text"
          ></v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-card-text
      v-if="hasAction"
      :class="{
        'pb-0': showTaskForm,
      }"
    >
      <div v-if="!showTaskForm">
        <v-btn
          @click="openTaskForm"
          :prepend-icon="mdiPlusCircle"
          block
          color="primary"
          variant="text"
        >
          Add task
        </v-btn>
      </div>
      <TaskForm v-model="showTaskForm" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useDate } from 'vuetify'
import { mdiPlusCircle, mdiTrashCan } from '@mdi/js'
import { useTaskStore } from '@/stores/useTaskStore'
import TaskForm from './TaskForm.vue'

const dateAdapter = useDate()
const taskStore = useTaskStore()

defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
  hasAction: {
    type: Boolean,
    default: false,
  },
})

// tasks logic
const TODAY = new Date()
TODAY.setHours(0, 0, 0, 0)

const getOverdue = (date) => dateAdapter.isBefore(new Date(date), TODAY)
const getDueDateColor = (date) => {
  return getOverdue(date) ? { 'text-red': true } : null
}
const getTaskStyle = (isCompleted) => {
  return isCompleted ? { 'text-decoration-line-through': true } : null
}

const completeTask = (key, value) => {
  taskStore.setTaskComplete(key, value)
}

const deleteTask = (key, parentKey) => {
  taskStore.deleteTask(key, parentKey)
}

// TaskForm logic
const showTaskForm = ref(false)
const openTaskForm = () => {
  showTaskForm.value = true
}

// show task logic
const openTaskDetail = (key) => {
  taskStore.setActiveKey(key)
}
</script>
