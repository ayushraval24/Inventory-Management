import React, { useEffect, useState } from "react";
import { getApi } from "../../redux/actions/apis";
import { useParams, useNavigate } from "react-router-dom";
import { BallTriangle } from "react-loader-spinner";
import axios from "axios";
import { toast } from "react-toastify";
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function VerifyUser() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsLoading(true);

    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/auth/verify/${token}`)
      .then((res) => {
        setIsLoading(false);
        toast.success(res?.data?.message);
        navigate("/login");
      })
      .catch((err) => {
        setMessage(err?.response?.data?.errors?.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Inventory management</h1>
      {isLoading ? (
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
      ) : (
        <h2>{message}</h2>
      )}
    </div>
  );
}
