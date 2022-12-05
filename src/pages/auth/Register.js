import React from "react";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

export default function Register() {
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validate = Yup.object({
    email: Yup.string()
      .required("Email required")
      .email("Invalid email address"),
    phone: Yup.string().required("Phone number required"),
    password: Yup.string().required("Password required"),
    confirmPassword: Yup.string()
      .required("Confirm password required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const submitHandler = (values) => {
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/auth/signup`, values)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="container-fluid login_container">
      <Formik
        initialValues={{
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={(values) => submitHandler(values)}
        validationSchema={validate}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => {
          return (
            <form onSubmit={handleSubmit} className="login_form">
              <h4 className="mb-3">Register</h4>
              <div className="mb-3">
                <input
                  type="email"
                  className={
                    errors.email
                      ? "form-control custom-form-control form-error-border"
                      : "form-control custom-form-control"
                  }
                  name="email"
                  placeholder="Email"
                  value={values.email}
                  onChange={handleChange}
                />
                {errors.email && touched.email && (
                  <p className="form-error">{errors.email}</p>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  className={
                    errors.phone
                      ? "form-control custom-form-control form-error-border"
                      : "form-control custom-form-control"
                  }
                  name="phone"
                  placeholder="Phone Number"
                  value={values.phone}
                  onChange={handleChange}
                />
                {errors.phone && touched.phone && (
                  <p className="form-error">{errors.phone}</p>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className={
                    errors.password
                      ? "form-control custom-form-control form-error-border"
                      : "form-control custom-form-control"
                  }
                  name="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                />
                {errors.password && touched.password && (
                  <p className="form-error">{errors.password}</p>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className={
                    errors.confirmPassword
                      ? "form-control custom-form-control form-error-border"
                      : "form-control custom-form-control"
                  }
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="form-error">{errors.confirmPassword}</p>
                )}
              </div>

              <button type="submit" className="btn  form_buttons mb-3">
                Submit
              </button>
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
