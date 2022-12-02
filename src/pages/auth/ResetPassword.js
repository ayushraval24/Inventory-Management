import React from "react";
import { useParams } from "react-router-dom";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import "./Auth.css";
import { toast } from "react-toastify";
import { BallTriangle } from "react-loader-spinner";
import { postApi } from "../../redux/actions/apis";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const validate = Yup.object({
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .required("Confirm password required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const submitHandler = (values) => {
    postApi(`/auth/change-password/${token}`, values)
      .then((res) => {
        toast.success(res.data.message);
        navigate("/login");
      })
      .catch((err) => {
        toast.error(err.response.data.errors.message);
      });
  };

  return (
    <div className="container-fluid login_container">
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
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
              <h4 className="mb-3">Reset Password</h4>
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
