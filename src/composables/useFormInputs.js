import { ref, useTemplateRef } from 'vue'
import { useCustomDate } from './useCustomDate'
import { useFormRules } from './useFormRules'

export const useFormInputs = () => {
  const { todayMidnight } = useCustomDate()
  const { ruleRequired, ruleMaxLen } = useFormRules()

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
    taskPriority: {
      val: 4,
    },
  })

  const form = ref(getInitialData())
  const isFormValid = ref()
  const formRef = useTemplateRef('form-task')
  const inputTaskNameRef = useTemplateRef('input-task-name')

  const setFormData = ({ name, desc, dateStr, priority }) => {
    form.value.taskName.val = name
    form.value.taskDesc.val = desc
    form.value.taskDate.val = new Date(dateStr)
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
