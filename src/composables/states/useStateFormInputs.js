import { ref, useTemplateRef } from 'vue'
import { useStateDates } from './useStateDates'
import { useMethodFormRules } from '../methods/useMethodFormRules'

export const useStateFormInputs = () => {
  const { todayMidnight } = useStateDates()
  const { ruleRequired, ruleMaxLen } = useMethodFormRules()

  const getInitialData = () => ({
    taskName: {
      val: '',
      label: 'Task Name',
      rules: [ruleRequired, (value) => ruleMaxLen(value, 150)],
    },
    taskDesc: {
      val: '',
      label: 'Task Description',
      rules: [(value) => ruleMaxLen(value, 300)],
    },
    taskDate: {
      val: todayMidnight,
    },
    taskTime: {
      val: null,
    },
    taskPriority: {
      val: 4,
    },
  })

  const form = ref(getInitialData())
  const isFormValid = ref()
  const formRef = useTemplateRef('form-task')
  const inputTaskNameRef = useTemplateRef('input-task-name')

  const setFormData = ({ name, desc, dateStr, time, priority }) => {
    const dateObj = new Date(dateStr)
    form.value.taskName.val = name
    form.value.taskDesc.val = desc
    form.value.taskDate.val = dateObj
    form.value.taskTime.val = time
    form.value.taskPriority.val = priority
  }

  const resetForm = () => {
    form.value = getInitialData()
  }

  return {
    form,
    isFormValid,
    formRef,
    inputTaskNameRef,
    setFormData,
    resetForm,
  }
}
