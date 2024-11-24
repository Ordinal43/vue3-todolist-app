import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { useDate } from 'vuetify'

const LOCAL_STORAGE_KEY = 'todo-list-tasks'

export const useTaskStore = defineStore('task', () => {
  // task CRUD logic
  const tasks = useLocalStorage(LOCAL_STORAGE_KEY, new Map())

  const addNewTask = (parentKey, level = 0, { name, desc, date }) => {
    const newId = uuidv4()

    tasks.value.set(newId, {
      key: newId,
      parentKey,
      childKeys: [],
      name,
      desc,
      date,
      level: level + 1,
      isCompleted: false,
    })

    if (parentKey !== null) {
      tasks.value.get(parentKey).childKeys.push(newId)
    }
  }

  const deleteTask = async (key, parentKey) => {
    // delete all subtasks
    const task = tasks.value.get(key)
    if (!task) return

    const childPromises = task.childKeys.map((childKey) => {
      return deleteTask(childKey, key)
    })

    // delete current
    tasks.value.delete(key)

    if (parentKey) {
      const parentTask = tasks.value.get(parentKey)
      parentTask.childKeys = parentTask.childKeys.filter((childKey) => {
        return childKey !== key
      })
    }

    return Promise.all(childPromises)
  }

  const setTaskStatus = async (key, isCompleted) => {
    const task = tasks.value.get(key)
    if (!task) return
    task.isCompleted = isCompleted

    const childPromises = task.childKeys.map((childKey) => {
      return setTaskStatus(childKey, isCompleted)
    })
    return Promise.all(childPromises)
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
        dateAdapter.isSameDay(new Date(task.date), TODAY) &&
        !task.isCompleted &&
        task.parentKey === null
      )
    })
  }
  const getTasksOverdue = () => {
    return getTasksArray().filter((task) => {
      return (
        dateAdapter.isBefore(new Date(task.date), TODAY) &&
        !task.isCompleted &&
        task.parentKey === null
      )
    })
  }
  const getTasksUpcoming = () => {
    return getTasksArray().filter((task) => {
      return (
        dateAdapter.isAfterDay(new Date(task.date), TODAY) &&
        !task.isCompleted &&
        task.parentKey === null
      )
    })
  }
  const getTasksCompleted = () => {
    return getTasksArray().filter((task) => {
      return task.isCompleted
    })
  }
  const getSubtasks = (key) => {
    return tasks.value.get(key).childKeys.map((key) => {
      return tasks.value.get(key)
    })
  }

  // active task logic
  const activeKey = ref(null)
  const showTaskDetail = ref(false)

  const setActiveKey = (key) => {
    activeKey.value = key
    showTaskDetail.value = true
  }

  const setShowTaskDetail = (value) => {
    showTaskDetail.value = value
  }

  return {
    tasks,
    addNewTask,
    deleteTask,
    setTaskStatus,
    updateTaskValue,
    updateTaskDate,
    getTasksToday,
    getTasksOverdue,
    getTasksUpcoming,
    getTasksCompleted,
    getSubtasks,
    activeKey,
    showTaskDetail,
    setActiveKey,
    setShowTaskDetail,
  }
})
