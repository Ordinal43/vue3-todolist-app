import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'

const LOCAL_STORAGE_KEY = 'todo-list-tasks'

export const useTaskStore = defineStore('task', () => {
  const tasks = useStorage(LOCAL_STORAGE_KEY, new Map())

  const setTask = (key, value) => {
    tasks.value.set(key, value)
  }

  const addNewTask = (taskName, taskDesc, taskDate) => {
    setTask(uuidv4(), {
      name: taskName,
      desc: taskDesc,
      date: taskDate,
      isComplete: false,
    })
  }

  const updateTask = (key, newValue) => {
    setTask(key, newValue)
  }

  const getTask = (key) => tasks.value.get(key)

  const deleteTask = (key) => {
    tasks.value.delete(key)
  }

  return {
    tasks,
    addNewTask,
    updateTask,
    getTask,
    deleteTask,
  }
})
