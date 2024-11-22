<template>
  <v-card>
    <v-card-title v-if="$slots.header">
      <slot name="header" />
    </v-card-title>
    <v-divider></v-divider>
    <v-container>
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
            @click="deleteTask(task.key)"
            :icon="mdiTrashCan"
            color="error"
            density="compact"
            variant="text"
          ></v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions v-if="$slots.footer">
      <slot name="footer" />
    </v-card-actions>
  </v-card>

  <TaskDetail v-model="showTaskDetail" />
</template>

<script setup>
import { mdiTrashCan } from '@mdi/js'
import { useTaskStore } from '@/stores/useTaskStore'
import { useDate } from 'vuetify/lib/framework.mjs'
import { ref } from 'vue'
import TaskDetail from './TaskDetail.vue'

const dateAdapter = useDate()
const taskStore = useTaskStore()

defineProps({
  tasks: {
    type: Array,
    default: () => [],
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

const deleteTask = (key) => {
  taskStore.deleteTask(key)
}

// TaskDetail logic
const showTaskDetail = ref(false)
const openTaskDetail = (key) => {
  taskStore.setActiveKey(key)
  showTaskDetail.value = true
}
</script>
