import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'
import { useDate } from 'vuetify/lib/framework.mjs'

const LOCAL_STORAGE_KEY = 'todo-list-tasks'

export const useTaskStore = defineStore('task', () => {
  // task CRUD logic
  const tasks = useStorage(LOCAL_STORAGE_KEY, new Map())

  const addNewTask = (taskName, taskDesc, taskDate) => {
    tasks.value.set(uuidv4(), {
      name: taskName,
      desc: taskDesc,
      date: taskDate,
      isCompleted: false,
    })
  }

  const deleteTask = (key) => {
    tasks.value.delete(key)
  }

  const setTaskComplete = (key, isCompleted) => {
    tasks.value.get(key).isCompleted = isCompleted
  }

  const updateTaskValue = (key, { name, desc }) => {
    tasks.value.get(key).name = name
    tasks.value.get(key).desc = desc
  }

  const updateTaskDate = (key, date) => {
    tasks.value.get(key).date = date
  }

  // getters
  const dateAdapter = useDate()
  const TODAY = new Date()
  TODAY.setHours(0, 0, 0, 0)

  const getTasksArray = () => {
    return Array.from(tasks.value).map(([key, value]) => ({
      key,
      ...value,
    }))
  }

  const getTasksToday = () => {
    return getTasksArray().filter((task) => {
      return (
        dateAdapter.isSameDay(new Date(task.date), TODAY) && !task.isCompleted
      )
    })
  }
  const getTasksOverdue = () => {
    return getTasksArray().filter((task) => {
      return (
        dateAdapter.isBefore(new Date(task.date), TODAY) && !task.isCompleted
      )
    })
  }
  const getTasksUpcoming = () => {
    return getTasksArray().filter((task) => {
      return (
        dateAdapter.isAfterDay(new Date(task.date), TODAY) && !task.isCompleted
      )
    })
  }
  const getTasksCompleted = () => {
    return getTasksArray().filter((task) => {
      return task.isCompleted
    })
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
    updateTaskValue,
    updateTaskDate,
    getTasksToday,
    getTasksOverdue,
    getTasksUpcoming,
    getTasksCompleted,
    activeKey,
    setActiveKey,
  }
})
