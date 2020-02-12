import React, { useState, useEffect } from "react";
import Select from "react-select";
import { FiX } from "react-icons/fi";
import { useFormik } from "formik";
import * as yup from "yup";
import shortid from "shortid";
import _ from "lodash";

const DynamicForm = () => {
  const [initialValueState, setInitialValueState] = useState({
    assignedTo: {}
  });
  const [workerDeleteMode, setWorkerDeleteMode] = useState(false);
  // const [schemaState, setSchemaState] = useState(null)

  const groupOptions = [
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

  //Inject Dynamic Schema
  const assignedToWorkerSchema = () => {
    let schemas = {};
    if (!_.isEmpty(initialValueState.assignedTo)) {
      Object.keys(initialValueState.assignedTo).map(worker => {
        schemas[worker] = yup.object().shape({
          value: yup.string().required(`${worker} Required`)
        });
        return null;
      });
    }
    return schemas;
  };

  //Validation Schema
  const Schema = yup.object().shape({
    assignedTo: yup.object().shape({
      ...assignedToWorkerSchema()
    })
  });

  const formik = useFormik({
    initialValues: initialValueState,
    validationSchema: Schema,
    onSubmit: values => {
      console.log("Formik values", formik);
      console.log("onSubmit values", values);
    }
  });

  const addNewElement = (lead = false) => {
    let Id = `assignedTo${shortid.generate()}`;
    let newInitialValueState = { [`${Id}`]: { lead } };
    let updatedInitValueState = { ...initialValueState };
    updatedInitValueState.assignedTo = {
      ...updatedInitValueState.assignedTo,
      ...newInitialValueState
    };
    formik.setValues(updatedInitValueState);
    setInitialValueState(updatedInitValueState);

    return null;
  };

  console.log("Outside", { ...Schema.fields.assignedTo.fields });
  const removeElement = workerId => {
    console.log("workerId", workerId);
    let oldSchema = { ...Schema.fields.assignedTo.fields };
    console.log("Old Schema", oldSchema);
    console.log(delete oldSchema[workerId]);
    console.log("Updated Schema", oldSchema);
    // delete oldSchema.fields.assignedTo.fields[workerId];

    // console.log(workerId);
    // console.log("Its here");
    // console.log("Init formik", formik);
    // let updatedInitValueState = { ...initialValueState };
    // delete updatedInitValueState.assignedTo[workerId];

    // let newInitialValueState = initialValueState;
    // delete initialValueState.assignedTo[workerId];
    // setInitialValueState(newInitialValueState);
    // console.log("After formik", formik);
    // delete formik.values.assignedTo[workerId];
    // delete formik.errors.assignedTo[workerId];
    // if (
    //   formik.touched &&
    //   formik.touched.assignedTo &&
    //   formik.touched.assignedTo[workerId]
    // ) {
    //   delete formik.touched.assignedTo[workerId];
    // }
    return null;
  };

  // console.log("Schema", Schema);

  //Create Lead Worker initially
  useEffect(() => {
    if (_.isEmpty(initialValueState.assignedTo)) {
      addNewElement(true);
    }
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <h1 style={{ textAlign: "center" }}>Select Form</h1>
      <div>
        <button
          type="button"
          onClick={() => {
            if (_.size(initialValueState.assignedTo) > 1) {
              setWorkerDeleteMode(!workerDeleteMode);
            }
          }}
        >
          - Worker
        </button>
        <button type="button" onClick={() => addNewElement(false)}>
          + Worker
        </button>
      </div>
      <br />
      <div>
        {!_.isEmpty(formik.values.assignedTo) &&
          Object.keys(formik.values.assignedTo).map(worker => {
            // console.log("addNewElement formik", formik);
            return (
              <div key={worker}>
                <label>
                  {formik.values.assignedTo[worker].lead ? "Lead" : "Worker"}
                </label>
                <Select
                  options={groupOptions}
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
                {workerDeleteMode && !formik.values.assignedTo[worker].lead && (
                  <span
                    className="actions"
                    onClick={() => removeElement(worker)}
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

//
//
//
//
//
//
//
//

// import React, { useState, useEffect } from "react";
// import { FiX } from "react-icons/fi";
// import { useFormik } from "formik";
// import * as yup from "yup";
// import shortid from "shortid";
// import _ from "lodash";

// import MySelect from "../helpers/MySelect";

// const DynamicSelectForm = () => {
//   const [initialValueState, setInitialValueState] = useState({
//     assignedTo: []
//   });
//   const [workerCountList, setWorkerCountList] = useState([]);
//   const [workerDeleteMode, setWorkerDeleteMode] = useState(false);

//   const groupOptions = [
//     {
//       label: "group1",
//       value: "group1"
//     },
//     {
//       label: "group2",
//       value: "group2"
//     },
//     {
//       label: "group3",
//       value: "group3"
//     }
//   ];

//   const assignedSchema = () => {
//     let schemas = {};
//     workerCountList.map(worker => {
//       schemas[worker.shortId] = yup
//         .string()
//         .ensure()
//         .required("Worker is required");
//       return null;
//     });
//     return schemas;
//   };

//   const Schema = yup.object().shape({
//     ...assignedSchema()
//   });

//   const addNewElement = (lead = false) => {
//     let Id = `assignedTo${shortid.generate()}`;
//     let newInitialValueState = { [`${Id}`]: "" };
//     formik.setValues({ ...formik.values, ...newInitialValueState });
//     if (lead) {
//       setWorkerCountList([...workerCountList, { shortId: Id, lead: true }]);
//     } else {
//       setWorkerCountList([...workerCountList, { shortId: Id }]);
//     }
//     return null;
//   };

//   const removeElement = workerField => {
//     setWorkerCountList(
//       workerCountList.filter(item => item.shortId !== workerField.shortId)
//     );
//     delete formik.values[workerField.shortId];
//     delete formik.errors[workerField.shortId];
//     delete formik.touched[workerField.shortId];
//     return null;
//   };

//   //Create Lead Worker initially
//   useEffect(() => {
//     if (workerCountList.length === 0) {
//       addNewElement(true);
//     }
//   }, []);

//   const formik = useFormik({
//     initialValues: initialValueState,
//     validationSchema: Schema,
//     onSubmit: values => {
//       console.log("values", values);
//       console.log("workerCountList", workerCountList);
//     }
//   });

//   console.log("New", formik);
//   // console.log("workerCountList", workerCountList);

//   return (
//     <form onSubmit={formik.handleSubmit}>
//       <h1 style={{ textAlign: "center" }}>Select Form</h1>
//       <div>
//         <button
//           type="button"
//           onClick={() => {
//             if (workerCountList.length > 1) {
//               setWorkerDeleteMode(!workerDeleteMode);
//             }
//           }}
//         >
//           - Worker
//         </button>
//         <button type="button" onClick={() => addNewElement(false)}>
//           + Worker
//         </button>
//       </div>
//       <br />
//       <div className="divideView divideView_items divideView_items_full workersGroup">
//         {workerCountList.map(workerField => (
//           <div className="divideView_items" key={workerField.shortId}>
//             {console.log(workerField)}
//             <MySelect
//               name={workerField.shortId}
//               label={workerField.lead ? "Lead" : "Worker"}
//               value={formik.values[workerField.shortId]}
//               onChange={formik.setFieldValue}
//               onBlur={formik.setFieldTouched}
//               error={formik.errors[workerField.shortId]}
//               touched={formik.touched[workerField.shortId]}
//               placeholder="Select Group"
//               className="divideView_items formRow--flex_row"
//               options={groupOptions}
//               isClearable={false}
//             />
//             {workerDeleteMode && !workerField.lead && (
//               <span
//                 className="actions"
//                 onClick={() => removeElement(workerField)}
//               >
//                 <FiX />
//               </span>
//             )}
//           </div>
//         ))}
//       </div>
//       <div>
//         <button type="submit">Submit</button>
//       </div>
//     </form>
//   );
// };

// export default DynamicSelectForm;
