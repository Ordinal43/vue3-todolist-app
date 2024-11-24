import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { useDate } from 'vuetify'
import { useCustomDate } from '@/composables/useCustomDate'

const LOCAL_STORAGE_KEY = 'todo-list-tasks'

export const useTaskStore = defineStore('task', () => {
  // task CRUD logic
  const tasks = useLocalStorage(LOCAL_STORAGE_KEY, new Map())
  const { todayMidnight } = useCustomDate()

  const clearStorage = () => {
    tasks.value = new Map()
  }

  const addNewTask = (parentKey, level = 0, { name, desc, date, priority }) => {
    const newId = uuidv4()

    tasks.value.set(newId, {
      key: newId,
      parentKey,
      childKeys: [],
      name,
      desc,
      date,
      priority,
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

  const updateTaskPriority = (key, priority) => {
    tasks.value.get(key).priority = priority
  }

  // getters
  const dateAdapter = useDate()

  const getTasksArray = computed(() => {
    return Array.from(tasks.value).map(([key, value]) => ({
      key,
      ...value,
    }))
  })

  const getTasksToday = computed(() => {
    return getTasksArray.value.filter((task) => {
      return (
        dateAdapter.isSameDay(new Date(task.date), todayMidnight) &&
        !task.isCompleted &&
        task.parentKey === null
      )
    })
  })

  const getTasksOverdue = computed(() => {
    return getTasksArray.value.filter((task) => {
      return (
        dateAdapter.isBefore(new Date(task.date), todayMidnight) &&
        !task.isCompleted &&
        task.parentKey === null
      )
    })
  })

  const getTasksUpcoming = computed(() => {
    return getTasksArray.value.filter((task) => {
      return (
        dateAdapter.isAfterDay(new Date(task.date), todayMidnight) &&
        !task.isCompleted &&
        task.parentKey === null
      )
    })
  })

  const getTasksCompleted = computed(() => {
    return getTasksArray.value.filter((task) => {
      return task.isCompleted
    })
  })

  const getSubtasks = (key) => {
    return tasks.value.get(key).childKeys.map((key) => {
      return tasks.value.get(key)
    })
  }

  return {
    tasks,
    clearStorage,
    addNewTask,
    deleteTask,
    setTaskStatus,
    updateTaskValue,
    updateTaskDate,
    updateTaskPriority,
    getTasksToday,
    getTasksOverdue,
    getTasksUpcoming,
    getTasksCompleted,
    getSubtasks,
  }
})
