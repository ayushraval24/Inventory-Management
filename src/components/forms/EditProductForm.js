import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { Formik } from "formik";
import "react-quill/dist/quill.snow.css";
import { quillFormat, quillModules } from "../../modules/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProduct } from "../../redux/actions/getSingleProduct";
import { BallTriangle } from "react-loader-spinner";
import { fetchEditProduct } from "../../redux/actions/editProductAction";

export default function EditProductForm({ productId }) {
  const dispatch = useDispatch();

  const productData = useSelector((state) => state.singleProductData.data);
  const detailsLoading = useSelector(
    (state) => state.singleProductData.isLoading
  );

  const [imageData, setImageData] = useState({});
  const [editor, setEditor] = useState("");
  const [blob, setBlob] = useState("");
  const [imageUpdated, setImageUpdated] = useState(false);

  useEffect(() => {
    dispatch(fetchSingleProduct(productId));
  }, []);

  const getInitialValues = () => {
    if (productData) {
      const initialData = {
        name: productData?.name,
        category: productData?.category,
        price: productData?.price,
        quantity: productData?.quantity,
      };

      return initialData;
    }
  };

  useEffect(() => {
    setEditor(productData?.description);
    if (productData?.image) {
      setImageData(
        `${process.env.REACT_APP_API_BASE_URL}/public/uploads/products/${productData?.image}`
      );
    }
  }, [productData]);

  const submitHandler = (values) => {
    const formData = new FormData();

    if (values.name !== productData?.name) {
      formData.append("name", values.name);
    }
    if (values.category !== productData?.category) {
      formData.append("category", values.category);
    }
    if (values.quantity !== productData?.quantity) {
      formData.append("quantity", values.quantity);
    }
    if (values.price !== productData?.price) {
      formData.append("price", values.price);
    }
    if (editor !== productData?.description) {
      formData.append("description", editor);
    }
    if (imageUpdated) {
      formData.append("image", imageData);
    }

    dispatch(fetchEditProduct(formData, productId));
  };

  return (
    <>
      {detailsLoading ? (
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
        productData && (
          <Formik
            onSubmit={(values) => submitHandler(values)}
            initialValues={getInitialValues()}
            // validationSchema={validate}
            enableReinitialize={true}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => {
              return (
                <div className="row p-3">
                  <form
                    onSubmit={handleSubmit}
                    className="login_form col-12 col-md-6"
                  >
                    <div className="mb-3 text-start">
                      <label htmlFor="image" className="form-label">
                        Product Image
                      </label>
                      <input
                        className={
                          errors.image
                            ? "form-control custom-form-control form-error-border"
                            : "form-control custom-form-control"
                        }
                        type="file"
                        id="image"
                        name="image"
                        value={values.image}
                        onChange={(e) => {
                          setBlob(URL.createObjectURL(e.target.files[0]));
                          setImageData(e.target.files[0]);
                          setImageUpdated(true);
                        }}
                      />
                    </div>
                    <div className="mb-3 text-start">
                      <label htmlFor="name" className="form-label">
                        Product name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className={
                          errors.image
                            ? "form-control custom-form-control form-error-border"
                            : "form-control custom-form-control"
                        }
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3 text-start">
                      <label htmlFor="category" className="form-label">
                        Product Category
                      </label>
                      <input
                        type="text"
                        id="category"
                        className="form-control"
                        name="category"
                        value={values.category}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3 text-start">
                      <label htmlFor="price" className="form-label">
                        Price
                      </label>
                      <input
                        type="number"
                        id="price"
                        className="form-control"
                        name="price"
                        value={values.price}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3 text-start">
                      <label htmlFor="quantity" className="form-label">
                        Quantity
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        className="form-control"
                        name="quantity"
                        value={values.quantity}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3 text-start">
                      <label htmlFor="quantity" className="form-label">
                        Product Description
                      </label>
                      <ReactQuill
                        theme="snow"
                        value={editor}
                        onChange={setEditor}
                        modules={quillModules}
                        formats={quillFormat}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn  form_buttons mb-3 custom_button"
                    >
                      Edit Product
                    </button>
                  </form>
                  <div className="col-md-6">
                    {blob !== "" ? (
                      <img src={blob} alt="" height="300px" width="300px" />
                    ) : (
                      <img
                        src={imageData}
                        alt=""
                        height="300px"
                        width="300px"
                      />
                    )}
                  </div>
                </div>
              );
            }}
          </Formik>
        )
      )}
    </>
  );
}
