import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { Formik } from "formik";
import "react-quill/dist/quill.snow.css";
import { quillFormat, quillModules } from "../../modules/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProduct } from "../../redux/actions/getSingleProduct";
import { BallTriangle, RotatingLines } from "react-loader-spinner";
import { fetchEditProduct } from "../../redux/actions/editProductAction";
import { fetchAllCategories } from "../../redux/actions/category/getAllCategoryAction";
import Select from "react-select";
import Default from "../../assets/images/default_product.jpg";
import { useNavigate } from "react-router-dom";

export default function EditProductForm({ productId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productData = useSelector((state) => state.singleProductData.data);
  const detailsLoading = useSelector(
    (state) => state.singleProductData.isLoading
  );
  const categoriesData = useSelector((state) => state.categoriesData.data);

  const [imageData, setImageData] = useState({});
  const [editor, setEditor] = useState("");
  const [blob, setBlob] = useState("");
  const [imageUpdated, setImageUpdated] = useState(false);
  const [catOptions, setCatOptions] = useState({});

  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchSingleProduct(productId));
  }, []);

  useEffect(() => {
    const finalData = categoriesData.map((item) => {
      return {
        label: item?.name,
        value: item?.id,
      };
    });
    setCatOptions(finalData);
  }, [categoriesData]);

  const getInitialValues = () => {
    if (productData) {
      const initialData = {
        name: productData?.name,
        category: {
          label: productData?.category?.name,
          value: productData?.category?.id,
        },
        price: productData?.price,
        quantity: productData?.quantity,
      };

      return initialData;
    }
  };

  useEffect(() => {
    setEditor(productData?.description);
    if (productData?.image == "") {
      setImageData(Default);
    } else {
      setImageData(
        `${process.env.REACT_APP_PRODUCT_IMAGES}/${productData?.image}`
      );
    }
  }, [productData]);

  const submitHandler = (values) => {
    const formData = new FormData();

    if (values.name !== productData?.name) {
      formData.append("name", values.name);
    }
    if (values.category !== productData?.category) {
      formData.append("category", values.category?.value);
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

    dispatch(fetchEditProduct(formData, productId, navigate));
  };

  return (
    <>
      {detailsLoading ? (
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
                    <div className="mb-3 text-start custom_lable">
                      <label htmlFor="category" className="form-label">
                        Product Category
                      </label>
                      <Select
                        id="category"
                        name="category"
                        options={catOptions}
                        onChange={(selectedOptions) =>
                          setFieldValue("category", selectedOptions.value)
                        }
                        placeholder="Select Category"
                        className={
                          errors.category
                            ? "custom-form-control form-error-border"
                            : "custom-form-control"
                        }
                        defaultValue={values.category}
                      />
                      {errors.category && touched.category && (
                        <p className="form-error">{errors.category}</p>
                      )}
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
                      <img src={blob} alt="" height="350px" width="450px" />
                    ) : (
                      <img
                        src={imageData}
                        alt=""
                        height="350px"
                        width="450px"
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
