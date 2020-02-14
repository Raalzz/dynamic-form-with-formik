import * as yup from "yup";

const validationSchema = ({ assinedToSchema }) => {
  return yup.object().shape({
    assignedTo: yup.object().shape({ ...assinedToSchema })
  });
};

export default validationSchema;
