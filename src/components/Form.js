import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import Select from "react-select";
import * as yup from "yup";
import _ from "lodash";

// import { Formik } from "formik";

const Form = () => {
  const Options = [
    {
      label: "dummy1",
      value: "dummy1"
    },
    {
      label: "dummy2",
      value: "dummy2"
    },
    {
      label: "dummy3",
      value: "dummy3"
    }
  ];

  const Schema = yup.object().shape({
    assignedTo: yup.object().shape({
      worker1: yup.object().shape({
        value: yup.string().required("worker1 Required")
      }),
      worker2: yup.object().shape({
        value: yup.string().required("worker2 Required")
      })
    })
  });

  const Demo = () => {
    let init = {
      assignedTo: {
        worker1: {
          shortId: "123"
        },
        worker2: {
          shortId: "456"
        },
        worker3: {
          shortId: "456"
        }
      }
    };

    for (const property in init.assignedTo) {
      console.log("Object Key", property);
      console.log("Object Property", init.assignedTo[property]);
    }
  };

  // console.log("Schema", Schema);

  const formik = useFormik({
    initialValues: {
      assignedTo: {
        worker1: {
          shortId: "123"
        },
        worker2: {
          shortId: "456"
        }
      }
    },
    validationSchema: Schema,
    onSubmit: values => {
      console.log("Formik values", formik);
      console.log("onSubmit values", values);
    }
  });

  // console.log("formik", formik);

  return (
    <form onSubmit={formik.handleSubmit}>
      <label>worker1</label>
      <Select
        options={Options}
        onChange={value => {
          // console.log("formik values", formik.values.assignedTo.worker1);
          // console.log("value", value);
          formik.setFieldValue("assignedTo.worker1", {
            ...value,
            ...formik.values.assignedTo.worker1
          });
        }}
        onBlur={() => {
          formik.setFieldTouched("assignedTo.worker1", true);
        }}
        value={formik.values.assignedTo.worker1}
        placeholder="Select Option"
        isClearable={false}
        isMulti={false}
      />
      {formik.errors.assignedTo &&
      formik.errors.assignedTo.worker1 &&
      formik.touched.assignedTo &&
      formik.touched.assignedTo.worker1 ? (
        <div>{formik.errors.assignedTo.worker1.value}</div>
      ) : null}
      <label>worker2</label>
      <Select
        options={Options}
        onChange={value => {
          formik.setFieldValue("assignedTo.worker2", {
            ...value,
            ...formik.values.assignedTo.worker2
          });
        }}
        onBlur={() => {
          formik.setFieldTouched("assignedTo.worker2", true);
        }}
        value={formik.values.assignedTo.worker2}
        placeholder="Select Option"
        isClearable={false}
        isMulti={false}
      />
      {formik.errors.assignedTo &&
      formik.errors.assignedTo.worker2 &&
      formik.touched.assignedTo &&
      formik.touched.assignedTo.worker2 ? (
        <div>{formik.errors.assignedTo.worker2.value}</div>
      ) : null}
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;

//
//
//
//
//

// import React, { useState, useEffect } from "react";
// import { useFormik } from "formik";
// import Schema from "../helpers/Validation";
// // import { Formik } from "formik";

// const Form = () => {
//   // Pass the useFormik() hook initial form values and a submit function that will
//   // be called when the form is submitted
//   const formik = useFormik({
//     initialValues: {
//       assignedTo: {
//         worker1: "",
//         worker2: ""
//       }
//     },
//     validationSchema: Schema,
//     onSubmit: values => {
//       alert(JSON.stringify(values, null, 2));
//     }
//   });

//   return (
//     <form onSubmit={formik.handleSubmit}>
//       <label>worker1</label>
//       <input
//         name="assignedTo.worker1"
//         type="text"
//         onChange={formik.handleChange}
//         onBlur={formik.handleBlur}
//         value={formik.values.assignedTo.worker1}
//       />
//       {formik.errors.assignedTo && formik.errors.assignedTo.worker1 ? (
//         <div>{formik.errors.assignedTo.worker1}</div>
//       ) : null}
//       <label>worker2</label>
//       <input
//         name="assignedTo.worker2"
//         type="text"
//         onChange={formik.handleChange}
//         onBlur={formik.handleBlur}
//         value={formik.values.assignedTo.worker2}
//       />
//       {formik.errors.assignedTo && formik.errors.assignedTo.worker2 ? (
//         <div>{formik.errors.assignedTo.worker2}</div>
//       ) : null}
//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default Form;
