import React, { useState } from "react";
import { useParams } from "react-router-dom";
import EditProductForm from "../components/forms/EditProductForm";

export default function EditProduct() {
  const { productId } = useParams();
  return (
    <>
      <p className="text-start h4 mt-3 mb-3">Edit Product</p>
      <EditProductForm productId={productId} />
    </>
  );
}
