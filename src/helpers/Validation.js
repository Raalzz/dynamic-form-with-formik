import * as yup from "yup";

const Schema = yup.object().shape({
  assignedTo: yup.object().shape({
    worker1: yup.string().required("Required"), // these constraints take precedence
    worker2: yup.string().required("Required") // these constraints take precedence
  })
});

export default Schema;
