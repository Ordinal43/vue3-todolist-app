import { useDetailStore } from '@/stores/useDetailStore'

export const useStateTaskDetailModal = () => {
  const detailStore = useDetailStore()

  const openTaskDetail = (key) => {
    detailStore.setActiveKey(key)
  }

  return {
    openTaskDetail,
  }
}
