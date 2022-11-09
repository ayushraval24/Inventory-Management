import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import {
  BsCart4,
  BsFillCartXFill,
  BsFillGridFill,
  BsFillEyeFill,
} from "react-icons/bs";
import { AiFillDollarCircle } from "react-icons/ai";
import { ImBin } from "react-icons/im";
import { FaEdit } from "react-icons/fa";
import { customStyles } from "../modules/utils";
import DataTable from "react-data-table-component";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "../redux/actions/getAllProductsAction";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteApi } from "../redux/actions/apis";
import { fetchInventoryStats } from "../redux/actions/getInventoryStats";
import { fetchAllCategories } from "../redux/actions/category/getAllCategoryAction";

export default function Dashboard() {
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allProducts = useSelector((state) => state.allProductsData.data);
  const inventoryData = useSelector((state) => state.inventoryData.data);
  const count = useSelector((state) => state.allProductsData.count);
  const categoryCount = useSelector((state) => state.categoriesData.count);

  const columns = [
    {
      name: "S/N",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Price ($)",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      sortable: true,
    },
    {
      name: "Value ($)",
      selector: (row) => row.value,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="product_actions">
          <BsFillEyeFill
            className="action_view mx-1 pointer_hover"
            onClick={() => {
              navigate(`/product-details/${row.id}`);
            }}
          />
          <FaEdit
            className="action_edit mx-1 pointer_hover"
            onClick={() => {
              navigate(`/edit-product/${row.id}`);
            }}
          />
          <ImBin
            className="action_delete mx-1 pointer_hover"
            onClick={() => {
              deleteProduct(row.id);
            }}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(fetchAllProducts(perPage, page));
    dispatch(fetchInventoryStats());
    dispatch(fetchAllCategories());
  }, []);

  useEffect(() => {
    setTotalRows(count);
  }, [count]);

  const handlePageChange = (p) => {
    if (p > 0) {
      dispatch(fetchAllProducts(perPage, p - 1));
      setPage(p - 1);
    }
  };

  const handlePerRowsChange = (p) => {
    if (p != 10) {
      dispatch(fetchAllProducts(p, page));
      setPerPage(p);
    }
  };

  const getProductsData = () => {
    const finalData = allProducts.map((product) => {
      return {
        id: product?.id,
        name: product?.name,
        category: product?.categoryData?.name,
        // category: product?.category,
        price: product?.price,
        quantity: product?.quantity,
        value: Number(product?.price) * Number(product?.quantity),
      };
    });
    return finalData;
  };

  const deleteProduct = (productId) => {
    Swal.fire({
      title: "Are you sure you want to delete this product?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteApi(`/products/${productId}`)
          .then((res) => {
            Swal.fire("Deleted!", "Your product has been deleted.", "success");
            dispatch(fetchAllProducts());
          })
          .catch((err) => {
            Swal.fire("Something went wrong");
          });
      }
    });
  };

  const handleSearch = (e) => {
    dispatch(fetchAllProducts(perPage, page, e.target.value));
  };

  return (
    <>
      {/* inventory stats */}
      <div className="inventory_stats">
        <p className="text-start h4 mt-2 mb-3 main_header">Inventory Stats</p>
        <div className="inventory_cards container-fluid row m-0">
          <div className="col-12 col-md-3 stats_cart row card_red">
            <BsCart4 className="stats_icon col-3" />
            <div className="status_details col-9">
              <p className="stats_card_heading mb-2 text-start ">
                Total Products
              </p>
              <p className="stats_card_details text-start">
                {inventoryData?.count}
              </p>
            </div>
          </div>
          <div className="col-12 col-md-3 stats_cart row card_green">
            <AiFillDollarCircle className="stats_icon col-3" />
            <div className="status_details col-9">
              <p className="stats_card_heading mb-2 text-start">
                Total Store Value
              </p>
              <p className="stats_card_details text-start">
                $ {inventoryData?.value}
              </p>
            </div>
          </div>
          <div className="col-12 col-md-3 stats_cart row card_blue">
            <BsFillCartXFill className="stats_icon col-3" />
            <div className="status_details col-9">
              <p className="stats_card_heading mb-2 text-start">Out of Stock</p>
              <p className="stats_card_details text-start">
                {inventoryData?.outOfStock}
              </p>
            </div>
          </div>
          <div className="col-12 col-md-3 stats_cart row card_yellow">
            <BsFillGridFill className="stats_icon col-3" />
            <div className="status_details col-9">
              <p className="stats_card_heading mb-2 text-start">Categories</p>
              <p className="stats_card_details text-start">{categoryCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="differ"></div>

      {/* inventory details */}
      <div className="inventory_items">
        <div className="row my-3">
          <div className="inventory_items col-md-3 text-start h4 main_header">
            Inventory Items
          </div>
          <div className="col-md-6"></div>
          <div className="inventory_search col-md-3">
            <input
              type="text"
              className="form-control custom-form-control"
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="inventory_products">
          <DataTable
            // title="Inventory Products"
            responsive={true}
            striped={true}
            columns={columns}
            data={getProductsData()}
            // progressPending={usersDataLoading}
            customStyles={customStyles}
            // expandableRowsComponent={RowComponent}
            pagination={true}
            paginationServer={true}
            onChangePage={handlePageChange}
            // onSort={handleSort}
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            paginationRowsPerPageOptions={[10, 15, 20, 25]}
          />
        </div>
      </div>
    </>
  );
}
