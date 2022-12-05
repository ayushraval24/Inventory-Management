import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BallTriangle, RotatingLines } from "react-loader-spinner";
import "../Dashboard.css";
import { fetchUserProfile } from "../../redux/actions/auth/getProfileAction";
import { useNavigate } from "react-router-dom";
import { AiOutlineForward } from "react-icons/ai";
import Avatar from "../../assets/images/default_avatar.jpg";

const Profile = () => {
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state?.profileData.data);
  const profileLoading = useSelector((state) => state?.profileData.isLoading);

  const image = profileData?.avatar
    ? `${process.env.REACT_APP_PROFILE_IMAGES}/${profileData?.avatar}`
    : Avatar;

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, []);

  return (
    <>
      {profileLoading ? (
        <div className="col-6 d-flex my-5 justify-content-center">
          <RotatingLines
            strokeColor="orange"
            strokeWidth="4"
            animationDuration="0.75"
            width="60"
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
                  // src={`${process.env.REACT_APP_PROFILE_IMAGES}/${profileData?.avatar}`}
                  src={image}
                  alt=""
                  height="350px"
                />
              </div>
              <div className="col-md-6 col-12 text-start p-3">
                <hr className="custom_hr" />
                <p className="fs-5 mb-0 custom_line_height">
                  <span className="custom_lable">
                    Name <AiOutlineForward />{" "}
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
                  <span className="custom_lable">
                    Email <AiOutlineForward />{" "}
                  </span>
                  <span>{profileData?.email} </span>
                </p>
                <hr className="custom_hr " />
                <p className="fs-5 mb-0 custom_line_height">
                  <span className=" custom_lable">
                    Phone <AiOutlineForward />
                  </span>
                  <span> {profileData?.phone}</span>
                </p>
                <hr className="custom_hr" />
                <p className="fs-5 mb-0 custom_line_height">
                  <span className=" custom_lable">
                    Bio <AiOutlineForward />{" "}
                  </span>
                  <span>{profileData?.bio} </span>
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
