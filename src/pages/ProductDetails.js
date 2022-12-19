import React, { useEffect, useState } from "react";
import Test from "../test.jpg";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProduct } from "../redux/actions/getSingleProduct";
import { BallTriangle, RotatingLines } from "react-loader-spinner";
import Default from "../assets/images/default_product.jpg";

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
      const destination = `${process.env.REACT_APP_PRODUCT_IMAGES}/${productData.image}`;
      setDestination(destination);
    } else {
      setDestination(Default);
    }

    if (productData?.quantity > 0) {
      setInStock(true);
    } else if (productData?.quantity === 0) {
      setInStock(false);
    }
  }, [productData]);

  return (
    <>
      {isLoading ? (
        <div className="col-6 my-5 d-flex justify-content-center">
          <RotatingLines
            strokeColor="orange"
            strokeWidth="4"
            animationDuration="0.75"
            width="60"
            visible={true}
          />
        </div>
      ) : (
        <div className="inventory_stats">
          <p className="text-start h4 mt-2 mb-3 main_header ">
            Product Details
          </p>
          <div className="col-md-6 col-12 custom_card">
            <div className="card p-3 text-start">
              <div className="d-flex justify-content-center">
                <img
                  src={destination}
                  alt=""
                  className="product_image border border-2 p-2 mb-3"
                  style={{
                    maxHeight: "350px",
                    maxWidth: "450px",
                  }}
                />
              </div>
              <p className="fs-4 mb-2">
                <span className="custom_weight"> {productData?.name}</span>
              </p>
              <hr className="my-1" />
              <p className="fs-4 mb-2">
                <span className="custom_lable">Product Availability :</span>{" "}
                {inStock === true ? (
                  <span className="text-success fw-bold">In Stock</span>
                ) : (
                  <span className="text-danger">Out Of Stock</span>
                )}
              </p>
              <hr className="my-1" />
              <p className="fs-6">
                <span className="custom_weight form-label custom_lable">
                  Category:
                </span>
                <span> {productData?.category?.name}</span>
              </p>
              <p className="fs-6">
                <span className="custom_weight form-label custom_lable">
                  Price:
                </span>
                <span> ${productData?.price}</span>
              </p>
              <p className="fs-6">
                <span className="custom_weight form-label custom_lable">
                  Quantity:
                </span>
                <span> {productData?.quantity}</span>
              </p>
              <p className="fs-6">
                <span className="custom_weight form-label custom_lable">
                  Total Value in Stock:{" "}
                </span>
                <span>
                  {Number(productData?.quantity) * Number(productData?.price)}
                </span>
              </p>
              <p className="fs-6">
                <span className="custom_weight form-label custom_lable">
                  Created At:
                </span>
                <span> {productData?.createdAt}</span>
              </p>
              <p className="fs-6">
                <span className="custom_weight form-label custom_lable">
                  Updated At:
                </span>
                <span> {productData?.updatedAt}</span>
              </p>
              <hr className="my-1" />
              <p className="fs-6">
                <span className="custom_weight form-label custom_lable">
                  Description:
                </span>{" "}
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
