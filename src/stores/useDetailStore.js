import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDetailStore = defineStore('detail', () => {
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
    activeKey,
    showTaskDetail,
    setActiveKey,
    setShowTaskDetail,
  }
})
