import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar";
import {
  AiOutlineDashboard,
  AiOutlineProfile,
  AiFillBank,
} from "react-icons/ai";
import { BiAddToQueue, BiExit, BiChat } from "react-icons/bi";
import { BsFillPersonFill, BsPersonLinesFill } from "react-icons/bs";

export default function Sidebar() {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userAccessToken");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
      <li className="d-flex justify-content-center align-items-center pb-3 mb-md-0 mx-auto me-md-auto text-white text-decoration-none">
        <AiFillBank className="fs-5 me-2" />
        <span className="fs-5  d-none d-sm-inline ">INVM</span>
      </li>
      <ul
        className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100"
        id="menu"
      >
        <li className="border-bottom w-100 text-start mb-3">
          <Link
            to="/dashboard"
            className="text-white nav-link px-0 d-flex align-items-center"
          >
            <AiOutlineDashboard className="sidebar_icon me-2" /> Dashboard
          </Link>
        </li>

        <li className="border-bottom w-100 text-start mb-3">
          <Link
            to="/add-product"
            className="text-white nav-link px-0 d-flex align-items-center "
          >
            <BiAddToQueue className="sidebar_icon me-2" />
            Add Product
          </Link>
        </li>

        <li className="border-bottom w-100 text-start mb-3">
          <a
            href="#submenu2"
            data-bs-toggle="collapse"
            className="text-white  nav-link px-0  align-middle d-flex align-items-center"
          >
            <AiOutlineProfile className="sidebar_icon me-2" />
            Account
          </a>
          <ul
            className="collapse nav flex-column ms-1"
            id="submenu2"
            data-bs-parent="#menu"
          >
            <li className="border-bottom w-100 text-start mb-2 py-2">
              <Link
                to="/profile"
                className="d-none d-sm-inline text-white  nav-link px-0 d-flex align-items-center"
              >
                <BsFillPersonFill className="sidebar_icon me-2" />
                Profile
              </Link>
            </li>
            <li className=" w-100 text-start mb-2 py-2">
              <Link
                to="/edit-profile"
                className="d-none d-sm-inline text-white  nav-link px-0 d-flex align-items-center"
              >
                <BsPersonLinesFill className="sidebar_icon me-2" />
                Edit Profile
              </Link>
            </li>
          </ul>
        </li>
        <li className="border-bottom w-100 text-start mb-3">
          <Link
            to="/report"
            className="text-white nav-link px-0 d-flex align-items-center"
          >
            <BiChat className="sidebar_icon me-2" />
            Report Bug
          </Link>
        </li>
        <li className="border-bottom w-100 text-start mb-3">
          <p
            className="text-white nav-link px-0 d-flex align-items-center mb-0"
            onClick={logoutHandler}
          >
            <BiExit className="sidebar_icon me-2" />
            Logout
          </p>
        </li>
      </ul>
      <hr />
    </div>
  );
}
