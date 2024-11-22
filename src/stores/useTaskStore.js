import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'

const LOCAL_STORAGE_KEY = 'todo-list-tasks'

export const useTaskStore = defineStore('task', () => {
  // task CRUD logic
  const tasks = useStorage(LOCAL_STORAGE_KEY, new Map())

  const addTaskToMap = (key, value) => {
    tasks.value.set(key, value)
  }

  const addNewTask = (taskName, taskDesc, taskDate) => {
    addTaskToMap(uuidv4(), {
      name: taskName,
      desc: taskDesc,
      date: taskDate,
      isComplete: false,
    })
  }

  const updateTask = (key, newValue) => {
    addTaskToMap(key, newValue)
  }

  const getTask = (key) => tasks.value.get(key)

  const deleteTask = (key) => {
    tasks.value.delete(key)
  }

  // active task logic
  const activeKey = ref(null)

  const setActiveKey = (key) => {
    activeKey.value = key
  }

  return {
    tasks,
    addNewTask,
    updateTask,
    getTask,
    deleteTask,
    activeKey,
    setActiveKey,
  }
})
