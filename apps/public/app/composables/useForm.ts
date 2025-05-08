import type { z } from 'zod';

export const useForm = <T extends z.ZodType>(schema: T, initialData: z.infer<T> = {} as z.infer<T>) => {
  const _initialData = JSON.stringify(initialData);
  const data = ref<z.infer<T>>(initialData);

  const errors = ref<z.ZodIssue[]>([]);
  const isValid = computed(() => errors.value.length === 0);
  const isSubmitting = ref(false);

  const validate = () => {
    const result = schema.safeParse(data.value);
    if (!result.success) {
      errors.value = result.error.issues;
    }
    else {
      errors.value = [];
    }
    return isValid.value;
  };

  const handleSubmit = async <R>(callback: (data: z.infer<T>) => Promise<R>) => {
    isSubmitting.value = true;
    if (validate()) {
      const result = await callback(data.value);
      isSubmitting.value = false;
      return result;
    }
    isSubmitting.value = false;
    return null;
  };

  const clearForm = () => {
    data.value = JSON.parse(_initialData);
    errors.value = [];
  };

  // TODO: Implement dynamic fields
  // const fields = Object.keys(schema.describe).reduce((acc, key) => {
  //   acc[key] = computed({
  //     get: () => (data.value as z.infer<T>)[key],
  //     set: (value: z.infer<T>[keyof z.infer<T>]) => {
  //       (data.value as z.infer<T>)[key] = value;
  //     },
  //   });
  //   return acc;
  // }, {} as { [key in keyof z.infer<T>]: ComputedRef<z.infer<T>[key]> });

  return {
    data,
    clearForm,
    // fields,
    errors,
    isValid,
    isSubmitting,
    validate,
    handleSubmit,
  };
};
