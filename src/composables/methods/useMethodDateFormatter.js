import { useDate } from 'vuetify'

export const useMethodDateFormatter = () => {
  const dateAdapter = useDate()
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

  const formatTime = (dateObj) => {
    const hours = dateObj.getHours().toString().padStart(2, '0')
    const minutes = dateObj.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  return {
    formatDate,
    formatTime,
  }
}
