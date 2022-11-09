import React from "react";
import Sidebar from "../components/Sidebar";
import AddProductForm from "../components/forms/AddProductForm";
import "../App.css";

export default function AddProduct() {
  return (
    <>
      <p className="text-start h4 mt-2 mb-1 main_header px-1">Add Product</p>
      <AddProductForm />
    </>
  );
}
