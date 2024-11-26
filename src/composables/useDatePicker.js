import { ref } from 'vue'
import { useDate } from 'vuetify'
import { useCustomDate } from './useCustomDate'

export const useDatePicker = () => {
  const dateAdapter = useDate()
  const { todayMidnight } = useCustomDate()

  const minDate = ref(todayMidnight)
  const menuDatePicker = ref(false)

  const formatDate = (dateValue) => {
    const shortDate = dateAdapter.format(dateValue, 'shortDate')

    dateValue = new Date(dateValue)

    if (dateValue.getHours() === 0 && dateValue.getMinutes() === 0) {
      return shortDate
    } else {
      const time = dateAdapter.format(dateValue, 'fullTime12h')
      return `${shortDate} ${time}`
    }
  }

  const setDateAndClose = (callback) => {
    callback()
    menuDatePicker.value = false
  }

  return {
    minDate,
    menuDatePicker,
    formatDate,
    setDateAndClose,
  }
}
