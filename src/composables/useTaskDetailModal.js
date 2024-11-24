import { useDetailStore } from '@/stores/useDetailStore'

export const useTaskDetailModal = () => {
  const detailStore = useDetailStore()

  const openTaskDetail = (key) => {
    detailStore.setActiveKey(key)
  }

  return {
    openTaskDetail,
  }
}
