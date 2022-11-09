import React, { useEffect, useState } from "react";
import Test from "../test.jpg";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProduct } from "../redux/actions/getSingleProduct";
import { BallTriangle } from "react-loader-spinner";

const ProductDetails = () => {
  const { productId } = useParams();

  const [destination, setDestination] = useState("");

  const [inStock, setInStock] = useState(false);

  const dispatch = useDispatch();
  const productData = useSelector((state) => state.singleProductData.data);
  const isLoading = useSelector((state) => state.singleProductData.isLoading);
  const error = useSelector((state) => state.singleProductData.error);

  useEffect(() => {
    dispatch(fetchSingleProduct(productId));
  }, []);

  useEffect(() => {
    if (productData?.image) {
      const destination = `${process.env.REACT_APP_API_BASE_URL}/public/uploads/products/${productData.image}`;
      setDestination(destination);
    }

    if (productData?.quantity > 0) {
      setInStock(true);
    }
  }, [productData]);

  return (
    <>
      {isLoading ? (
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
        <div className="inventory_stats">
          <p className="text-start h4 mt-2 mb-3">Product Details</p>
          <div className="col-md-6 col-12">
            <div className="card p-3 text-start">
              <div className="d-flex justify-content-center">
                <img
                  src={destination}
                  alt=""
                  className="product_image border border-2 p-2 mb-3"
                  height="400px"
                  // width="300px"
                />
              </div>
              <p className="fs-4">
                <span>Product Availability :</span>{" "}
                {inStock ? (
                  <span className="text-success fw-bold">In Stock</span>
                ) : (
                  <span className="text-danger">Out Of Stock</span>
                )}
              </p>
              <hr className="my-1" />
              <p className="fs-4">
                <span className="custom_weight">Name:</span>
                <span> {productData?.name}</span>
              </p>
              <p className="fs-6">
                <span className="custom_weight">Category:</span>
                <span> {productData?.category}</span>
              </p>
              <p className="fs-6">
                <span className="custom_weight">Price:</span>
                <span> ${productData?.price}</span>
              </p>
              <p className="fs-6">
                <span className="custom_weight">Quantity:</span>
                <span> {productData?.quantity}</span>
              </p>
              <p className="fs-6">
                <span className="custom_weight">Total Value in Stock:</span>
                <span>
                  {Number(productData?.quantity) * Number(productData?.price)}
                </span>
              </p>
              <p className="fs-6">
                <span className="custom_weight">Created At:</span>
                <span> {productData?.createdAt}</span>
              </p>
              <p className="fs-6">
                <span className="custom_weight">Updated At:</span>
                <span> {productData?.updatedAt}</span>
              </p>
              <hr className="my-1" />
              <p className="fs-6">
                <span className="custom_weight">Description:</span>
                <span
                  dangerouslySetInnerHTML={{ __html: productData?.description }}
                />
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
