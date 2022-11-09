import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BallTriangle } from "react-loader-spinner";
import "../Dashboard.css";
import { fetchUserProfile } from "../../redux/actions/auth/getProfileAction";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { fetchEditProfile } from "../../redux/actions/auth/editProfileActions";

const EditProfile = () => {
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state?.profileData.data);
  const profileLoading = useSelector((state) => state?.profileData.isLoading);

  const [avatarData, setAvatarData] = useState("");
  const [blob, setBlob] = useState("");
  const [avatarUpdated, setAvatarUpdated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, []);

  const getInitialValues = () => {
    if (profileData) {
      const initialData = {
        first_name: profileData?.first_name || "",
        last_name: profileData?.last_name || "",
        email: profileData?.email,
        phone: profileData?.phone,
        bio: "",
      };
      return initialData;
    }
  };

  useEffect(() => {
    if (profileData?.avatar) {
      setAvatarData(
        `${process.env.REACT_APP_PROFILE_IMAGES}/${profileData?.avatar}`
      );
    }
  }, [profileData]);

  const submitHandler = (values) => {
    const formData = new FormData();

    if (values?.first_name !== profileData?.first_name) {
      formData.append("first_name", values?.first_name);
    }
    if (values?.last_name !== profileData?.last_name) {
      formData.append("last_name", values?.last_name);
    }
    if (values?.phone !== profileData?.phone) {
      formData.append("phone", values?.phone);
    }
    if (avatarUpdated) {
      formData.append("avatar", avatarData);
    }

    dispatch(fetchEditProfile(formData, navigate));
  };

  return (
    <>
      {profileLoading ? (
        <div className="col-6 d-flex justify-content-center">
          <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="#4fa94d"
            ariaLabel="ball-triangle-loading"
            wrapperClass={{}}
            wrapperStyle=""
            visible={true}
          />
        </div>
      ) : (
        profileData && (
          <>
            <div className="inventory_stats container-fluid">
              <p className="text-start h4 mt-2 mb-3 main_header">Profile</p>
              <div className="container-fluid row">
                <div className="col-md-8 row white_bg-card p-3">
                  <div className="col-md-6 col-12 ">
                    {blob !== "" ? (
                      <img
                        src={blob}
                        alt=""
                        height="350px"
                        className="col-md-6 col-12 "
                        style={{ width: "auto" }}
                      />
                    ) : (
                      <img
                        src={avatarData}
                        alt=""
                        height="350px"
                        className="col-md-6 col-12 "
                        style={{ width: "auto" }}
                      />
                    )}
                  </div>
                  <div className="col-md-6 col-12 text-start">
                    <Formik
                      onSubmit={(values) => submitHandler(values)}
                      initialValues={getInitialValues()}
                      // validationSchema={validate}
                      enableReinitialize={true}
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
                          <form onSubmit={handleSubmit} className="login_form ">
                            <div className="mb-3 text-start">
                              <label
                                htmlFor="first_name"
                                className="form-label custom_lable"
                              >
                                First Name
                              </label>
                              <input
                                type="text"
                                id="first_name"
                                className={
                                  errors.confirmPassword
                                    ? "form-control custom-form-control form-error-border"
                                    : "form-control custom-form-control"
                                }
                                name="first_name"
                                value={values.first_name}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="mb-3 text-start">
                              <label
                                htmlFor="last_name"
                                className="form-label custom_lable"
                              >
                                Last Name
                              </label>
                              <input
                                type="text"
                                id="last_name"
                                className={
                                  errors.confirmPassword
                                    ? "form-control custom-form-control form-error-border"
                                    : "form-control custom-form-control"
                                }
                                name="last_name"
                                value={values.last_name}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="mb-3 text-start">
                              <label
                                htmlFor="email"
                                className="form-label custom_lable"
                              >
                                Email
                              </label>
                              <input
                                type="text"
                                id="email"
                                className={
                                  errors.confirmPassword
                                    ? "form-control custom-form-control form-error-border"
                                    : "form-control custom-form-control"
                                }
                                name="email"
                                value={values.email}
                                disabled
                                //   onChange={handleChange}
                              />
                            </div>
                            <div className="mb-3 text-start">
                              <label
                                htmlFor="phone"
                                className="form-label custom_lable"
                              >
                                Phone
                              </label>
                              <input
                                type="text"
                                id="phone"
                                className={
                                  errors.confirmPassword
                                    ? "form-control custom-form-control form-error-border"
                                    : "form-control custom-form-control"
                                }
                                name="phone"
                                value={values.phone}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="mb-3 text-start">
                              <label
                                htmlFor="image"
                                className="form-label custom_lable"
                              >
                                Edit Avatar
                              </label>
                              <input
                                className="form-control"
                                type="file"
                                id="image"
                                name="image"
                                //   value={values.avatar}
                                onChange={(e) => {
                                  setBlob(
                                    URL.createObjectURL(e.target.files[0])
                                  );
                                  setAvatarData(e.target.files[0]);
                                  setAvatarUpdated(true);
                                }}
                              />
                            </div>
                            <button
                              className="btn my-2 custom_button"
                              type="submit"
                            >
                              Update
                            </button>
                          </form>
                        );
                      }}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="inventory_stats">
              <p className="text-start h4 mt-2 mb-3">Profile</p>
              <div className="row">
                <div className="col-md-8 col-12 row custom_card">
                  {blob !== "" ? (
                    <img
                      src={blob}
                      alt=""
                      height="350px"
                      className="col-md-6 col-12 p-4"
                    />
                  ) : (
                    <img
                      src={avatarData}
                      alt=""
                      height="350px"
                      className="col-md-6 col-12 p-4"
                    />
                  )}

                  <div className="col-md-6 col-12 text-start py-3">
                    <Formik
                      onSubmit={(values) => submitHandler(values)}
                      initialValues={getInitialValues()}
                      // validationSchema={validate}
                      enableReinitialize={true}
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
                          <form onSubmit={handleSubmit} className="login_form ">
                            <div className="mb-3 text-start">
                              <label
                                htmlFor="first_name"
                                className="form-label"
                              >
                                First Name
                              </label>
                              <input
                                type="text"
                                id="first_name"
                                className={
                                  errors.confirmPassword
                                    ? "form-control custom-form-control form-error-border"
                                    : "form-control custom-form-control"
                                }
                                name="first_name"
                                value={values.first_name}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="mb-3 text-start">
                              <label htmlFor="last_name" className="form-label">
                                Last Name
                              </label>
                              <input
                                type="text"
                                id="last_name"
                                className={
                                  errors.confirmPassword
                                    ? "form-control custom-form-control form-error-border"
                                    : "form-control custom-form-control"
                                }
                                name="last_name"
                                value={values.last_name}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="mb-3 text-start">
                              <label htmlFor="email" className="form-label">
                                Email
                              </label>
                              <input
                                type="text"
                                id="email"
                                className={
                                  errors.confirmPassword
                                    ? "form-control custom-form-control form-error-border"
                                    : "form-control custom-form-control"
                                }
                                name="email"
                                value={values.email}
                                disabled
                                //   onChange={handleChange}
                              />
                            </div>
                            <div className="mb-3 text-start">
                              <label htmlFor="phone" className="form-label">
                                Phone
                              </label>
                              <input
                                type="text"
                                id="phone"
                                className={
                                  errors.confirmPassword
                                    ? "form-control custom-form-control form-error-border"
                                    : "form-control custom-form-control"
                                }
                                name="phone"
                                value={values.phone}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="mb-3 text-start">
                              <label htmlFor="image" className="form-label">
                                Edit Avatar
                              </label>
                              <input
                                className="form-control"
                                type="file"
                                id="image"
                                name="image"
                                //   value={values.avatar}
                                onChange={(e) => {
                                  setBlob(
                                    URL.createObjectURL(e.target.files[0])
                                  );
                                  setAvatarData(e.target.files[0]);
                                  setAvatarUpdated(true);
                                }}
                              />
                            </div>
                            <button
                              className="btn btn-primary my-2"
                              type="submit"
                            >
                              Update
                            </button>
                          </form>
                        );
                      }}
                    </Formik>
                  </div>
                </div>
              </div>
            </div> */}
          </>
        )
      )}
    </>
  );
};

export default EditProfile;
