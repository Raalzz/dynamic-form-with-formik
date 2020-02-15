import React, { useState, useEffect } from "react";
import Select from "react-select";
import { FiX } from "react-icons/fi";
import { useFormik } from "formik";
import * as yup from "yup";
import shortid from "shortid";
import _ from "lodash";
import validationSchema from "./validationSchema";

const DynamicForm2 = () => {
  const [locationsDeleteMode, setLocationsDeleteMode] = useState(false);
  const [initialValueState, setInitialValueState] = useState({
    locations: {}
  });
  const [locationsSchema, setLocationsSchema] = useState({});
  const [selectedLocations, setSelectedLocations] = useState([]);

  const OptionsData = [
    {
      label: "location1",
      value: "location1"
    },
    {
      label: "location2",
      value: "location2"
    },
    {
      label: "location3",
      value: "location3"
    }
  ];

  const formik = useFormik({
    initialValues: initialValueState,
    validationSchema: validationSchema(locationsSchema),
    onSubmit: values => {
      console.log("Formik values", formik);
      console.log("onSubmit values", values);
    }
  });

  //Create Lead Location initially
  useEffect(() => {
    if (_.isEmpty(initialValueState.locations)) {
      addLocationField(true);
    }
  }, []);

  useEffect(() => {
    // https://github.com/jaredpalmer/formik/issues/529#issuecomment-571294217
    setSelectedLocations(
      Object.keys(formik.values.locations)
        .filter(
          location =>
            formik.values.locations[location].label &&
            formik.values.locations[location].value
        ) // Filter out the lead is yet to be selected
        .map(location => ({
          label: formik.values.locations[location].label,
          value: formik.values.locations[location].value
        }))
    );
  }, [formik.values.locations]);

  const Options = () => {
    return _.xorBy(OptionsData, selectedLocations, "value");
  };

  //Function to Add Field
  const addLocationField = (lead = false) => {
    let Id = `locations${shortid.generate()}`;
    let newInitialValueState = { [`${Id}`]: { lead } };

    //To update Initial Values
    let updatedInitValueState = { ...initialValueState };
    updatedInitValueState.locations = {
      ...updatedInitValueState.locations,
      ...newInitialValueState
    };

    //To update Schema
    let updatedSchema = { ...locationsSchema };
    let newSchema = {
      [`${Id}`]: yup.object().shape({
        value: yup
          .string()
          .required(`${lead ? "lead" : "location"} is required`)
      })
    };
    updatedSchema = { ...updatedSchema, ...newSchema };

    //Get current values from the formik and add new field to it
    let updatedFormikValues = { ...formik.values };
    updatedFormikValues.locations = {
      ...updatedFormikValues.locations,
      ...newInitialValueState
    };

    formik.setValues(updatedFormikValues);
    setInitialValueState(updatedInitValueState);
    setLocationsSchema(updatedSchema);
    return null;
  };

  //Function to Remove Field
  const removeLocationField = locationId => {
    //TODO: setSelectedLocations
    setSelectedLocations(
      selectedLocations.filter(
        obj => obj.value !== formik.values.locations[locationId].value
      )
    );
    let oldSchema = { ...locationsSchema };
    delete oldSchema[locationId];
    setLocationsSchema(oldSchema);
    delete formik.values.locations[locationId];
    if (
      formik.errors &&
      formik.errors.locations &&
      formik.errors.locations[locationId]
    ) {
      delete formik.errors.locations[locationId];
    }
    if (
      formik.touched &&
      formik.touched.locations &&
      formik.touched.locations[locationId]
    ) {
      delete formik.touched.locations[locationId];
    }
    return null;
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <h1 style={{ textAlign: "center" }}>Select Form</h1>
      <div>
        {_.size(formik.values.locations) > 1 ? (
          <button
            type="button"
            onClick={() => {
              if (_.size(initialValueState.locations) > 1) {
                setLocationsDeleteMode(!locationsDeleteMode);
              }
            }}
          >
            - Location
          </button>
        ) : (
          <button type="button" disabled>
            - Location
          </button>
        )}

        {_.size(formik.values.locations) < OptionsData.length ? (
          <button type="button" onClick={() => addLocationField(false)}>
            + Location
          </button>
        ) : (
          <button type="button" disabled>
            + Location
          </button>
        )}
      </div>
      <div>
        {!_.isEmpty(formik.values.locations) &&
          Object.keys(formik.values.locations).map(location => {
            return (
              <div className="card">
                <div className="container">
                  <div key={location}>
                    {locationsDeleteMode &&
                      !formik.values.locations[location].lead && (
                        <span
                          className="actions"
                          onClick={() => removeLocationField(location)}
                        >
                          <FiX />
                        </span>
                      )}
                    <label>{"Location"}</label>
                    <Select
                      options={Options()}
                      onChange={value => {
                        formik.setFieldValue(
                          `locations.${location}`,
                          _.defaults(value, formik.values.locations[location])
                        );
                      }}
                      onBlur={() => {
                        formik.setFieldTouched(`locations.${location}`, true);
                      }}
                      value={formik.values.locations[location]}
                      placeholder="Select Option"
                      isClearable={false}
                      isMulti={false}
                    />
                    {formik.errors.locations &&
                    formik.errors.locations[location] &&
                    formik.touched.locations &&
                    formik.touched.locations[location] ? (
                      <div>{formik.errors.locations[location].value}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default DynamicForm2;
