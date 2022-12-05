import React, { useState } from "react";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import "./Auth.css";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();

  const validate = Yup.object({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string().required("Password is required"),
  });

  const submitHandler = (values) => {
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/auth/signin`, values)
      .then((res) => {
        localStorage.setItem("userAccessToken", res?.data?.data?.token);
        localStorage.setItem("userId", res?.data?.data?.id);
        navigate("/dashboard");
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log("Err: ", err);
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="container-fluid login_container">
      <Formik
        initialValues={{ email: "", password: "" }}
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
              <h4 className="mb-3">Login</h4>
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
              <button type="submit" className="btn  form_buttons mb-3">
                Submit
              </button>
              <p className="mb-2">
                <Link to="/forgot-password">Forgot password?</Link>
              </p>
              <p className="mb-2">
                Don't have an account? Register <Link to="/register">here</Link>
              </p>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
