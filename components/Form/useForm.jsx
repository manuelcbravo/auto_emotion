import { useState } from 'react';

const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (field, value) => {
    setValues({
      ...values,
      [field]: value,
    });
  };

  const handleChangeNested = (field, value) => {
    const [mainField, nestedField] = field.split('.');
    setValues(prevValues => ({
      ...prevValues,
      [mainField]: {
        ...prevValues[mainField],
        [nestedField]: value,
      },
    }));
  };

  return {
    values,
    handleChange,
    setValues,
    handleChangeNested
  };
};

export default useForm;
