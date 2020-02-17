import React, { useState, useEffect } from "react";
import Select from "react-select";
import { FiX } from "react-icons/fi";
import { useFormik } from "formik";
import * as yup from "yup";
import shortid from "shortid";
import _ from "lodash";

const locationOptionsData = [
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

const contactOptions = [
  {
    label: "contact1",
    value: "contact1"
  },
  {
    label: "contact2",
    value: "contact2"
  },
  {
    label: "contact3",
    value: "contact3"
  }
];

const CustomerDetails = ({
  formik,
  initialValueState,
  setInitialValueState,
  locationsSchema,
  setLocationsSchema,
  contactSchema,
  setContactSchema
}) => {
  const [selectedLocations, setSelectedLocations] = useState([]);

  //Create One Location Field initially
  useEffect(() => {
    if (_.isEmpty(initialValueState.locations)) {
      addLocationField();
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

  const locationOptions = () => {
    return _.xorBy(locationOptionsData, selectedLocations, "value");
  };

  //Function to Add Field
  const addLocationField = () => {
    //generate temporary uinque id
    let shortId = shortid.generate();
    let locationShortId = `locations${shortId}`;
    let contactShortId = `contacts${shortId}`;
    let locationInitialValueState = {
      [`${locationShortId}`]: {
        [`${contactShortId}`]: {}
      }
    };
    let contactInitialValueState = { [`${contactShortId}`]: {} };

    //To update Initial Values
    let updatedLocationInitValueState = { ...initialValueState };
    updatedLocationInitValueState.locations = {
      ...updatedLocationInitValueState.locations,
      ...locationInitialValueState
    };
    let updatedContactInitValueState = { ...updatedLocationInitValueState };
    updatedContactInitValueState.contacts = {
      ...updatedContactInitValueState.contacts,
      ...contactInitialValueState
    };

    //To update Schema
    let updatedLocationSchema = { ...locationsSchema };
    let newLocationSchema = {
      [`${locationShortId}`]: yup.object().shape({
        value: yup.string().required("location is required")
      })
    };
    updatedLocationSchema = { ...updatedLocationSchema, ...newLocationSchema };

    let updatedContactSchema = { ...contactSchema };
    let newContactSchema = {
      [`${contactShortId}`]: yup.object().shape({
        value: yup.string().required("contact is required")
      })
    };

    updatedContactSchema = { ...updatedContactSchema, ...newContactSchema };

    //To update Formik Values
    //Get current values from the formik and add new field to it
    let updatedFormikLocationValues = { ...formik.values };
    updatedFormikLocationValues.locations = {
      ...updatedFormikLocationValues.locations,
      ...locationInitialValueState
    };

    let updatedFormikContactValues = { ...updatedFormikLocationValues };
    updatedFormikContactValues.contacts = {
      ...updatedFormikContactValues.contacts,
      ...contactInitialValueState
    };

    //Update All Required States
    formik.setValues(updatedFormikContactValues); //formik State
    setInitialValueState(updatedContactInitValueState); //initialValue State
    setLocationsSchema(updatedLocationSchema); //location Schema
    setContactSchema(updatedContactSchema); //contact Schema
    return null;
  };

  //Function to Remove Field
  const removeLocationField = locationId => {
    console.log(locationId);
    // TODO: setSelectedLocations;
    setSelectedLocations(
      selectedLocations.filter(
        obj => obj.value !== formik.values.locations[locationId].value
      )
    );

    //Update New Schema
    let oldSchema = { ...locationsSchema };
    delete oldSchema[locationId];
    setLocationsSchema(oldSchema);
    delete formik.values.locations[locationId];

    //Update Errors Array
    if (
      formik.errors &&
      formik.errors.locations &&
      formik.errors.locations[locationId]
    ) {
      delete formik.errors.locations[locationId];
    }

    //Update Touched Fields
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
    <div>
      <h1 style={{ textAlign: "center" }}>Select Form</h1>
      <div>
        {_.size(formik.values.locations) > 1 ? (
          <button
            type="button"
            onClick={() => {
              if (_.size(initialValueState.locations) > 1) {
                // setLocationsDeleteMode(!locationsDeleteMode);
                //This Function should be removed if there is a carasoul
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

        {_.size(formik.values.locations) < locationOptionsData.length ? (
          <button type="button" onClick={() => addLocationField(false)}>
            + Location
          </button>
        ) : (
          <button type="button" disabled>
            + Location
          </button>
        )}
      </div>

      {!_.isEmpty(formik.values.locations) &&
        Object.keys(formik.values.locations).map(location => {
          return (
            <div className="card" key={location}>
              <div className="container">
                <span
                  className="actions"
                  onClick={() => removeLocationField(location)}
                >
                  <FiX />
                </span>

                <div>
                  <label>{"Location"}</label>
                  <Select
                    options={locationOptions()}
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
                <div>
                  <label>{"Contact"}</label>
                  <Select
                    options={contactOptions}
                    onChange={value => {
                      formik.setFieldValue(
                        `contacts.${"contacts" +
                          location.split("locations").pop()}`,
                        _.defaults(
                          value,
                          formik.values.contacts[
                            "contacts" + location.split("locations").pop()
                          ]
                        )
                      );
                    }}
                    onBlur={() => {
                      formik.setFieldTouched(
                        `contacts.${"contacts" +
                          location.split("locations").pop()}`,
                        true
                      );
                    }}
                    value={
                      formik.values.contacts[
                        "contacts" + location.split("locations").pop()
                      ]
                    }
                    placeholder="Select Option"
                    isClearable={false}
                    isMulti={false}
                  />
                  {formik.errors.contacts &&
                  formik.errors.contacts[
                    "contacts" + location.split("locations").pop()
                  ] &&
                  formik.touched.contacts &&
                  formik.touched.contacts[
                    "contacts" + location.split("locations").pop()
                  ] ? (
                    <div>
                      {
                        formik.errors.contacts[
                          "contacts" + location.split("locations").pop()
                        ].value
                      }
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default CustomerDetails;
