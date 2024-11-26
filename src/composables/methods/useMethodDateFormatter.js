import { useDate } from 'vuetify'

export const useMethodDateFormatter = () => {
  const dateAdapter = useDate()
  const formatDate = (dateValue) => {
    return dateAdapter.format(dateValue, 'shortDate')
  }

  const formatTime = (timeStr) => {
    if (timeStr !== null) {
      const [hour, minute] = timeStr.split(':').map(Number)
      const period = hour >= 12 ? 'PM' : 'AM'
      const formattedHour = hour % 12 || 12

      // Include minutes only if they are not 0
      return minute === 0
        ? `${formattedHour} ${period}`
        : `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`
    }
    return ''
  }

  return {
    formatDate,
    formatTime,
  }
}
