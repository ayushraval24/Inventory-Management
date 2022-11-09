import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { Formik } from "formik";
import * as Yup from "yup";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddProduct } from "../../redux/actions/addProductAction";
import { quillFormat, quillModules } from "../../modules/utils";
import { toast } from "react-toastify";
import { BallTriangle } from "react-loader-spinner";
import { fetchAllCategories } from "../../redux/actions/category/getAllCategoryAction";
import Select from "react-select";

export default function AddProductForm() {
  const [imageData, setImageData] = useState({});
  const [editor, setEditor] = useState("");
  const [blob, setBlob] = useState("");
  const [catOptions, setCatOptions] = useState({});
  const [category, setCategory] = useState({});

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const isLoading = useSelector((state) => state.addProductData.isLoading);
  const productData = useSelector((state) => state.addProductData.data);
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
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("category", category.value);
    formData.append("description", editor);
    formData.append("price", values.price);
    formData.append("quantity", values.quantity);
    formData.append("image", imageData);

    dispatch(fetchAddProduct(formData, navigate));

    // resetForm();
    // setImageData({});
    // setEditor("");
  };

  const validate = Yup.object({
    name: Yup.string().required("Product name is required"),
    // category: Yup.string().required("Product category is required"),
  });

  const [initialValues, setInitialValues] = useState({
    name: "",
    price: 0,
    quantity: 0,
    category: {},
  });

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
                        setImageData(e.target.files[0]);
                        setBlob(URL.createObjectURL(e.target.files[0]));
                      }}
                    />
                    {errors.image && touched.image && (
                      <p className="form-error">{errors.image}</p>
                    )}
                  </div>
                  <div className="mb-3 text-start">
                    <label htmlFor="name" className="form-label">
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
                  <div className="mb-3 text-start">
                    <label htmlFor="category" className="form-label">
                      Product Category
                    </label>
                    <Select
                      id="category"
                      name="category"
                      options={catOptions}
                      onChange={(e) => {
                        setCategory(e);
                      }}
                      placeholder="Select Category"
                      value={category}
                      className={
                        errors.category
                          ? "custom-form-control form-error-border"
                          : "custom-form-control"
                      }
                    />
                    {/* <input
                      type="text"
                      id="category"
                      className="form-control"
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                    /> */}
                    {errors.category && touched.category && (
                      <p className="form-error">{errors.category}</p>
                    )}
                  </div>
                  <div className="mb-3 text-start">
                    <label htmlFor="price" className="form-label">
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
                    <label htmlFor="quantity" className="form-label">
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
                    <label htmlFor="quantity" className="form-label">
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
                  {blob !== "" && <img src={blob} alt="" height="350px" />}
                </div>
              </div>
            );
          }}
        </Formik>
      )}
    </>
  );
}
