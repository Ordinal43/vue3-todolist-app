import { ref } from 'vue'
import { useCustomDate } from './useCustomDate'

export const useDatePicker = () => {
  const { todayMidnight } = useCustomDate()

  const minDate = ref(todayMidnight)
  const menuDatePicker = ref(false)

  return {
    minDate,
    menuDatePicker,
  }
}
