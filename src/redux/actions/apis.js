import axios from "axios";

const endPoint = process.env.REACT_APP_API_ENDPOINT;

const apiConfig = (flag = false) => {
  if (localStorage.getItem("userAccessToken")) {
    return {
      headers: {
        Authorization: `bearer ${localStorage.userAccessToken}`,
        "Content-Type": flag ? "multipart/form-data" : "application/json",
      },
      method: "PUT,DELETE,POST,GET,OPTION",
    };
  }
  return {};
};

export const getApi = (url, params) => {
  return axios.get(`${endPoint}${url}`, {
    params: params,
    ...apiConfig(),
  });
};

export const fullGetApi = (url, params) => {
  console.log("This is url: ", url);
  return axios.get(`${url}`, {
    ...apiConfig(),
  });
};

export const postApi = (url, apiData, flag) => {
  return axios.post(`${endPoint}${url}`, apiData, apiConfig(flag));
};

export const putApi = (url, apiData, flag) => {
  return axios.put(`${endPoint}${url}`, apiData, apiConfig(flag));
};

export const deleteApi = (url) => {
  return axios.delete(`${endPoint}${url}`, apiConfig());
};

export const deleteApiWithData = (url, apiData, flag) => {
  return axios.delete(`${endPoint}${url}`, {
    data: apiData,
    ...apiConfig(),
  });
};
