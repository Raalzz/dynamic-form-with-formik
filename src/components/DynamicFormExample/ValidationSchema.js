import * as yup from "yup";

const validationSchema = (locationsSchema, contactSchema) => {
  return yup.object().shape({
    locations: yup.object().shape({ ...locationsSchema }),
    contacts: yup.object().shape({ ...contactSchema })
  });
};

export default validationSchema;
