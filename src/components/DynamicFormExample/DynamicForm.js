import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import _ from "lodash";
import validationSchema from "./ValidationSchema";

import CustomerDetails from "./CustomerDetails";

const DynamicForm = () => {
  const [initialValueState, setInitialValueState] = useState({
    locations: {},
    contacts: {}
  });
  const [locationsSchema, setLocationsSchema] = useState({});
  const [contactSchema, setContactSchema] = useState({});

  //Formik Initialisation
  const formik = useFormik({
    initialValues: initialValueState,
    validationSchema: validationSchema(locationsSchema, contactSchema),
    onSubmit: values => {
      console.log("Formik values", formik);
      console.log("onSubmit values", values);
    }
  });

  console.log("formik", formik);

  return (
    <form onSubmit={formik.handleSubmit}>
      <CustomerDetails
        formik={formik}
        initialValueState={initialValueState}
        setInitialValueState={setInitialValueState}
        locationsSchema={locationsSchema}
        setLocationsSchema={setLocationsSchema}
        contactSchema={contactSchema}
        setContactSchema={setContactSchema}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default DynamicForm;
