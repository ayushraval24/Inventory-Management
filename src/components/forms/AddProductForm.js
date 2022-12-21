import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddProduct } from "../../redux/actions/addProductAction";
import { quillFormat, quillModules } from "../../modules/utils";
import { RotatingLines } from "react-loader-spinner";
import ImageGallery from "react-image-gallery";

import { fetchAllCategories } from "../../redux/actions/category/getAllCategoryAction";
import Select from "react-select";
import "react-quill/dist/quill.snow.css";

export default function AddProductForm() {
  // const [imageData, setImageData] = useState([]);
  const [editor, setEditor] = useState("");
  const [blob, setBlob] = useState([]);
  const [catOptions, setCatOptions] = useState({});
  const [formData, setFormData] = useState(new FormData());

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const isLoading = useSelector((state) => state.addProductData.isLoading);
  const categoriesData = useSelector((state) => state.categoriesData.data);

  useEffect(() => {
    dispatch(fetchAllCategories());
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

  const submitHandler = (values, resetForm) => {
    // const formData = new FormData();

    formData.append("name", values.name);
    formData.append("category", values.category);
    formData.append("description", editor);
    formData.append("price", values.price);
    formData.append("quantity", values.quantity);
    // formData.append("image", imageData);

    dispatch(fetchAddProduct(formData, navigate));
  };

  const validate = Yup.object({
    name: Yup.string().required("Product name is required"),
    category: Yup.string().required("Category is required"),
  });

  const [initialValues, setInitialValues] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
  });

  return (
    <>
      {isLoading && (
        <div className="col-6 my-5 d-flex justify-content-center">
          <RotatingLines
            strokeColor="orange"
            strokeWidth="4"
            animationDuration="0.75"
            width="60"
            visible={true}
          />
        </div>
      )}
      <Formik
        onSubmit={(values, { resetForm }) => submitHandler(values, resetForm)}
        initialValues={initialValues}
        validationSchema={validate}
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
            <div className="row p-3 ">
              <form
                onSubmit={handleSubmit}
                className="login_form col-12 col-md-6 custom_card px-3"
              >
                <div className="mb-3 text-start">
                  <label htmlFor="image" className="form-label custom_lable">
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
                    multiple={true}
                    onChange={(e) => {
                      formData.delete("image");
                      for (let i = 0; i < e.target.files.length; i++) {
                        formData.append("image", e.target.files[i]);
                      }
                      setBlob(
                        [...e.target.files].map((item) => {
                          return {
                            original: URL.createObjectURL(item),
                            thumbnail: URL.createObjectURL(item),
                          };
                        })
                      );
                      // setBlob(
                      //   e.target.files?.map((item) => URL.createObjectURL(item))
                      // );
                      // setImageData(e.target.files[0]);
                      // setBlob(URL.createObjectURL(e.target.files[0]));
                    }}
                  />
                  {errors.image && touched.image && (
                    <p className="form-error">{errors.image}</p>
                  )}
                </div>
                <div className="mb-3 text-start">
                  <label htmlFor="name" className="form-label custom_lable">
                    Product name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={
                      errors.name
                        ? "form-control custom-form-control form-error-border"
                        : "form-control custom-form-control"
                    }
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                  />
                  {errors.name && touched.name && (
                    <p className="form-error">{errors.name}</p>
                  )}
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
                        ? "custom-form-control"
                        : "custom-form-control"
                    }
                  />
                  {errors.category && touched.category && (
                    <p className="form-error">{errors.category}</p>
                  )}
                </div>
                <div className="mb-3 text-start">
                  <label htmlFor="price" className="form-label custom_lable">
                    Product Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    className={
                      errors.price
                        ? "form-control custom-form-control form-error-border"
                        : "form-control custom-form-control"
                    }
                    name="price"
                    value={values.price}
                    onChange={handleChange}
                  />
                  {errors.price && touched.price && (
                    <p className="form-error">{errors.price}</p>
                  )}
                </div>
                <div className="mb-3 text-start">
                  <label htmlFor="quantity" className="form-label custom_lable">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    className={
                      errors.quantity
                        ? "form-control custom-form-control form-error-border"
                        : "form-control custom-form-control"
                    }
                    name="quantity"
                    value={values.quantity}
                    onChange={handleChange}
                  />
                  {errors.quantity && touched.quantity && (
                    <p className="form-error">{errors.quantity}</p>
                  )}
                </div>
                <div className="mb-3 text-start">
                  <label htmlFor="quantity" className="form-label custom_lable">
                    Product Description
                  </label>
                  <ReactQuill
                    name="description"
                    theme="snow"
                    value={editor}
                    onChange={setEditor}
                    modules={quillModules}
                    formats={quillFormat}
                  />
                  {errors.description && touched.description && (
                    <p className="form-error">{errors.description}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn form_buttons mb-3 custom_button"
                >
                  Add Product
                </button>
              </form>
              <div className="col-md-6">
                {blob !== "" && (
                  <ImageGallery
                    items={blob}
                    showPlayButton={false}
                    showNav={false}
                    showFullscreenButton={false}
                  />
                )}
                {/* <img src={blob} alt="" height="350px" width="450px" /> */}
              </div>
            </div>
          );
        }}
      </Formik>
    </>
  );
}
