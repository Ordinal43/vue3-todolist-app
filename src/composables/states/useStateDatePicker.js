import { ref } from 'vue'
import { useStateDates } from './useStateDates'

export const useStateDatePicker = () => {
  const { todayMidnight } = useStateDates()

  const minDate = ref(todayMidnight)
  const menuDatePicker = ref(false)

  return {
    minDate,
    menuDatePicker,
  }
}
