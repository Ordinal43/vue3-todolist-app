import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'

const LOCAL_STORAGE_KEY = 'todo-list-tasks'

export const useTaskStore = defineStore('task', () => {
  // task CRUD logic
  const tasks = useStorage(LOCAL_STORAGE_KEY, new Map())

  const addNewTask = (taskName, taskDesc, taskDate) => {
    tasks.value.set(uuidv4(), {
      name: taskName,
      desc: taskDesc,
      date: taskDate,
      isComplete: false,
    })
  }

  const deleteTask = (key) => {
    tasks.value.delete(key)
  }

  const setTaskComplete = (key, isComplete) => {
    tasks.value.get(key).isComplete = isComplete
  }

  // active task logic
  const activeKey = ref(null)

  const setActiveKey = (key) => {
    activeKey.value = key
  }

  return {
    tasks,
    addNewTask,
    deleteTask,
    setTaskComplete,
    activeKey,
    setActiveKey,
  }
})
