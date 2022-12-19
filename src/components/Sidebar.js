import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar";
import {
  AiOutlineDashboard,
  AiOutlineProfile,
  AiFillBank,
} from "react-icons/ai";
import { BiAddToQueue, BiExit, BiChat } from "react-icons/bi";
import { BsFillPersonFill, BsPersonLinesFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Sidebar() {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userAccessToken");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      <li
        className="d-flex justify-content-center align-items-center py-3 mb-md-0 mx-auto me-md-auto text-white text-decoration-none "
        style={{ maxHeight: "20%" }}
      >
        <GiHamburgerMenu
          className="d-block d-lg-none fs-5"
          style={{ position: "absolute", left: "20" }}
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        />
        <AiFillBank className="fs-5 me-2" />
        <span className="fs-5 d-sm-inline">INVM</span>
      </li>
      <div
        id="sidebar"
        className={
          showMobileMenu
            ? "d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-80"
            : "d-none" +
              " d-md-block d-lg-block d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-80"
        }
      >
        <ul
          className=" nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100"
          id="menu"
        >
          <li className="border-bottom w-100 text-start mb-3">
            <Link
              to="/dashboard"
              className="text-white nav-link px-0 d-flex align-items-center"
              onClick={() => setShowMobileMenu(false)}
            >
              <AiOutlineDashboard className="sidebar_icon me-2" /> Dashboard
            </Link>
          </li>

          <li className="border-bottom w-100 text-start mb-3">
            <Link
              to="/add-product"
              className="text-white nav-link px-0 d-flex align-items-center "
              onClick={() => setShowMobileMenu(false)}
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
              <li className="border-bottom w-100 text-start mb-2 py-0 py-md-2">
                <Link
                  to="/profile"
                  className="d-sm-inline text-white  nav-link px-0 d-flex align-items-center"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <BsFillPersonFill className="sidebar_icon me-2" />
                  Profile
                </Link>
              </li>
              <li className="w-100 text-start mb-0 py-0 py-md-2">
                <Link
                  to="/edit-profile"
                  className="d-sm-inline text-white  nav-link px-0 d-flex align-items-center"
                  onClick={() => setShowMobileMenu(false)}
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
              onClick={() => setShowMobileMenu(false)}
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
      </div>
    </>
  );
}
