import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { postApi } from "../../redux/actions/apis";
import { toast } from "react-toastify";

export default function ReportBugForm() {
  const initialValues = {
    subject: "",
    message: "",
  };

  const submitHandler = (values) => {
    postApi(`/bugs`, values)
      .then((res) => {
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        toast.error(err?.data?.message);
      });
  };

  const validate = Yup.object({
    subject: Yup.string().required("Subject is required"),
    message: Yup.string().required("Message is required"),
  });

  return (
    <Formik
      onSubmit={(values, { resetForm }) => submitHandler(values, resetForm)}
      initialValues={initialValues}
      validationSchema={validate}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
      }) => {
        return (
          <div className="row p-3">
            <form
              onSubmit={handleSubmit}
              className="login_form col-12 col-md-6"
            >
              <div className="mb-3 text-start">
                <input
                  type="text"
                  className={
                    errors.subject
                      ? "form-control custom-form-control form-error-border"
                      : "form-control custom-form-control"
                  }
                  name="subject"
                  value={values.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                />
                {errors.subject && touched.subject && (
                  <p className="form-error">{errors.subject}</p>
                )}
              </div>
              <div className="mb-3 text-start">
                <textarea
                  type="text"
                  className={
                    errors.message
                      ? "form-control custom-form-control form-error-border"
                      : "form-control custom-form-control"
                  }
                  name="message"
                  value={values.message}
                  onChange={handleChange}
                  placeholder="Message"
                  rows="10"
                />
                {errors.message && touched.message && (
                  <p className="form-error">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="btn form_buttons mb-3 custom_button"
              >
                Submit
              </button>
            </form>
          </div>
        );
      }}
    </Formik>
  );
}
