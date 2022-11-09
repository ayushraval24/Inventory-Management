import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BallTriangle } from "react-loader-spinner";
import "../Dashboard.css";
import { fetchUserProfile } from "../../redux/actions/auth/getProfileAction";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state?.profileData.data);
  const profileLoading = useSelector((state) => state?.profileData.isLoading);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, []);

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
        <div className="inventory_stats container-fluid">
          <p className="text-start h4 mt-2 mb-3 main_header">Profile</p>
          <div className="container-fluid row">
            <div className="col-md-8 row white_bg-card">
              <div className="col-md-6 col-12 p-3">
                <img
                  src={`${process.env.REACT_APP_PROFILE_IMAGES}/${profileData?.avatar}`}
                  alt=""
                  height="350px"
                />
              </div>
              <div className="col-md-6 col-12 text-start p-3">
                <hr className="custom_hr" />
                <p className="fs-5 mb-0 custom_line_height">
                  <span className="custom_weight custom_lable">
                    Name -&gt;{" "}
                  </span>

                  {profileData?.last_name === null &&
                  profileData?.first_name === null ? (
                    <span> N/A </span>
                  ) : (
                    <span>
                      {profileData?.first_name} {profileData?.last_name}
                    </span>
                  )}
                </p>
                <hr className="custom_hr" />
                <p className="fs-5 mb-0 custom_line_height">
                  <span className="custom_weight custom_lable">
                    Email -&gt;{" "}
                  </span>
                  <span>{profileData?.email} </span>
                </p>
                <hr className="custom_hr " />
                <p className="fs-5 mb-0 custom_line_height">
                  <span className="custom_weight custom_lable">
                    Phone -&gt;
                  </span>
                  <span> {profileData?.phone}</span>
                </p>
                <hr className="custom_hr" />
                <p className="fs-5 mb-0 custom_line_height">
                  <span className="custom_weight custom_lable">Bio -&gt; </span>
                  <span> </span>
                </p>
                <hr className="custom_hr" />
                <button
                  className="btn custom_button my-2"
                  onClick={() => navigate("/edit-profile")}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
