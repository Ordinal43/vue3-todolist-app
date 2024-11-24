import { useTaskStore } from '@/stores/useTaskStore'

export const useTaskDetailModal = () => {
  const taskStore = useTaskStore()

  const openTaskDetail = (key) => {
    taskStore.setActiveKey(key)
  }

  return {
    openTaskDetail,
  }
}
