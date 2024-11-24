<template>
  <v-card variant="flat">
    <v-container>
      <div v-if="$slots.header" class="mb-3">
        <h4>
          <slot name="header" />
        </h4>
      </div>
      <v-divider></v-divider>
      <v-row
        v-for="task in tasks"
        :key="task.key"
        class="mt-3 align-center"
        no-gutters
        cols="12"
      >
        <v-col cols="1">
          <v-checkbox
            :model-value="task.isCompleted"
            @update:model-value="(value) => setTaskStatus(task.key, value)"
            :base-color="getPriorityColor(task.priority)"
            :color="getPriorityColor(task.priority)"
            hide-details
          ></v-checkbox>
        </v-col>
        <v-col>
          <v-card @click="openTaskDetail(task.key)" class="pa-2" variant="text">
            <h5 :class="getTaskStyle(task.isCompleted)">
              {{ task.name }}
            </h5>
            <div class="d-flex ga-2">
              <v-chip
                v-if="task.childKeys.length"
                :prepend-icon="mdiFileTree"
                density="comfortable"
                size="small"
              >
                {{ task.childKeys.length }}
              </v-chip>
              <v-chip
                :prepend-icon="mdiCalendarClock"
                :color="getDueDateColor(task.date)"
                size="small"
                density="comfortable"
              >
                {{ dateAdapter.format(task.date, 'shortDate') }}
              </v-chip>
            </div>
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
    <v-card-text v-if="hasAction" class="pt-0">
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
import { useDate } from 'vuetify'
import {
  mdiCalendarClock,
  mdiFileTree,
  mdiPlusCircle,
  mdiTrashCan,
} from '@mdi/js'
import { useTaskStore } from '@/stores/useTaskStore'
import { useCustomDate } from '@/composables/useCustomDate'
import { useTaskPriority } from '@/composables/useTaskPriority'
import { useTaskForm } from '@/composables/useTaskForm'
import TaskForm from './TaskForm.vue'

const dateAdapter = useDate()
const taskStore = useTaskStore()
const { todayMidnight } = useCustomDate()
const { getPriorityColor } = useTaskPriority()
const { showTaskForm, openTaskForm } = useTaskForm()

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

const getOverdue = (date) => dateAdapter.isBefore(new Date(date), todayMidnight)
const getDueDateColor = (date) => {
  return getOverdue(date) ? 'red' : null
}
const getTaskStyle = (isCompleted) => {
  return isCompleted ? { 'text-decoration-line-through': true } : null
}

const setTaskStatus = async (key, value) => {
  await taskStore.setTaskStatus(key, value)
}

const deleteTask = async (key, parentKey) => {
  await taskStore.deleteTask(key, parentKey)
}

// show task logic
const openTaskDetail = (key) => {
  taskStore.setActiveKey(key)
}
</script>
