import React, { useState } from "react";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { postApi } from "../../redux/actions/apis";
import { toast } from "react-toastify";
import { BallTriangle } from "react-loader-spinner";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const validate = Yup.object({
    email: Yup.string().required("Email is required").email("Email is invalid"),
  });

  const navigate = useNavigate();

  const submitHandler = (values) => {
    setLoading(true);
    postApi(`/auth/forgot-password`, values)
      .then((res) => {
        setLoading(false);
        toast.success(res.data.message);
        navigate("/login");
      })
      .catch((err) => {
        setLoading(false);
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
              <h4 className="mb-3">Forgot Password</h4>
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

              <button
                type="submit"
                className="btn form_buttons mb-3"
                disabled={loading}
              >
                Reset Password
                {loading && (
                  <div className="col-6 d-flex justify-content-center">
                    <BallTriangle
                      height={10}
                      width={10}
                      radius={5}
                      color="#4fa94d"
                      ariaLabel="ball-triangle-loading"
                      visible={true}
                    />
                  </div>
                )}
              </button>
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
