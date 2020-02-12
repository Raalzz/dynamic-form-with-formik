import React, { useState, useEffect } from "react";
import Select from "react-select";
import { FiX } from "react-icons/fi";
import { useFormik } from "formik";
import * as yup from "yup";
import shortid from "shortid";
import _ from "lodash";

const Options = [
  {
    label: "group1",
    value: "group1"
  },
  {
    label: "group2",
    value: "group2"
  },
  {
    label: "group3",
    value: "group3"
  }
];

const DynamicForm = () => {
  const [assinedToDeleteMode, setAssinedToDeleteMode] = useState(false);
  const [initialValueState, setInitialValueState] = useState({
    assignedTo: {}
  });
  const [assinedToSchema, setAssinedToSchema] = useState({});

  //Create Lead Worker initially
  useEffect(() => {
    if (_.isEmpty(initialValueState.assignedTo)) {
      addWorkerField(true);
    }
  }, []);

  //Validation Schema
  const Schema = yup.object().shape({
    assignedTo: yup.object().shape({ ...assinedToSchema })
  });

  const formik = useFormik({
    initialValues: initialValueState,
    validationSchema: Schema,
    onSubmit: values => {
      console.log("Formik values", formik);
      console.log("onSubmit values", values);
    }
  });

  //Function to Add Field
  const addWorkerField = (lead = false) => {
    let Id = `assignedTo${shortid.generate()}`;
    let newInitialValueState = { [`${Id}`]: { lead } };

    //To update Initial Values
    let updatedInitValueState = { ...initialValueState };
    updatedInitValueState.assignedTo = {
      ...updatedInitValueState.assignedTo,
      ...newInitialValueState
    };

    //To update Schema
    let updatedSchema = { ...assinedToSchema };
    let newSchema = {
      [`${Id}`]: yup.object().shape({
        value: yup.string().required(`${Id} is Required`)
      })
    };
    updatedSchema = { ...updatedSchema, ...newSchema };

    //Get current values from the formik and add new field to it
    let updatedFormikValues = { ...formik.values };
    updatedFormikValues.assignedTo = {
      ...updatedFormikValues.assignedTo,
      ...newInitialValueState
    };

    formik.setValues(updatedFormikValues);
    setInitialValueState(updatedInitValueState);
    setAssinedToSchema(updatedSchema);
    return null;
  };

  //Function to Remove Field
  const removeWorkerField = workerId => {
    let oldSchema = { ...assinedToSchema };
    delete oldSchema[workerId];
    setAssinedToSchema(oldSchema);
    delete formik.values.assignedTo[workerId];
    if (
      formik.errors &&
      formik.errors.assignedTo &&
      formik.errors.assignedTo[workerId]
    ) {
      delete formik.errors.assignedTo[workerId];
    }
    if (
      formik.touched &&
      formik.touched.assignedTo &&
      formik.touched.assignedTo[workerId]
    ) {
      delete formik.touched.assignedTo[workerId];
    }
    return null;
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <h1 style={{ textAlign: "center" }}>Select Form</h1>
      <div>
        <button
          type="button"
          onClick={() => {
            if (_.size(initialValueState.assignedTo) > 1) {
              setAssinedToDeleteMode(!assinedToDeleteMode);
            }
          }}
        >
          - Worker
        </button>
        <button type="button" onClick={() => addWorkerField(false)}>
          + Worker
        </button>
      </div>
      <br />
      <div>
        {!_.isEmpty(formik.values.assignedTo) &&
          Object.keys(formik.values.assignedTo).map(worker => {
            return (
              <div key={worker}>
                <label>
                  {formik.values.assignedTo[worker].lead ? "Lead" : "Worker"}
                </label>
                <Select
                  options={Options}
                  onChange={value => {
                    formik.setFieldValue(`assignedTo.${worker}`, {
                      ...value,
                      ...formik.values.assignedTo[worker]
                    });
                  }}
                  onBlur={() => {
                    formik.setFieldTouched(`assignedTo.${worker}`, true);
                  }}
                  value={formik.values.assignedTo[worker]}
                  placeholder="Select Option"
                  isClearable={false}
                  isMulti={false}
                />
                {formik.errors.assignedTo &&
                formik.errors.assignedTo[worker] &&
                formik.touched.assignedTo &&
                formik.touched.assignedTo[worker] ? (
                  <div>{formik.errors.assignedTo[worker].value}</div>
                ) : null}
                {assinedToDeleteMode && !formik.values.assignedTo[worker].lead && (
                  <span
                    className="actions"
                    onClick={() => removeWorkerField(worker)}
                  >
                    <FiX />
                  </span>
                )}
              </div>
            );
          })}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default DynamicForm;
