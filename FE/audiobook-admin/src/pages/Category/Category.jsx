import React, { useEffect, useState } from "react";
import "./Category.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import {
  addCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "../../services/CategoryService";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
const Category = () => {
  // Show list category
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await listCategories();
      if (response.data.code === 1000) {
        setCategories(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories!");
    } finally {
      setLoading(false);
    }
  };

  const showError = (errorCode) => {
    let title = "Error!";
    let text = "Please try again.";
    let icon = "error";

    switch (errorCode) {
      case 1000:
        break;
      case 1001:
        text = "Category already there!";
        break;
      case 1002:
        text = "Category name cannot empty.";
        break;
      case 1003:
        text = "Cannot find category!";
        break;
      case 1004:
        text = "Category still has audiobooks!";
        break;
      case 9998:
        text = "Server error.";
        break;
      case 9999:
        text = "Fatal error.";
        break;
      default:
        text = `Unknown error (${errorCode}). Please try again.`;
    }

    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: "OK",
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add a category
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const handleAdd = async () => {
    if (!categoryName.trim()) {
      showError(1002);
      return;
    }
    try {
      setLoading(true);
      const response = await addCategory({ name: categoryName });
      if (response.data.code === 1000) {
        setCategories([...categories, response.data.result]); // update the category list
        setCategoryName("");
        setShowAddPopup(false);
        toast.success("Category added successfully!");
      }
    } catch (error) {
      showError(error.response.data.code);
      toast.error("Failed to add category!");
    } finally {
      setLoading(false);
    }
  };

  // Update a category
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  const openUpdatePopup = (category) => {
    setSelectedCategory(category);
    setNewCategoryName(category.name);
    setShowUpdatePopup(true);
  };

  const handleUpdate = async () => {
    if (!newCategoryName.trim()) {
      showError(1002);
      return;
    }
    try {
      setLoading(true);
      await updateCategory(selectedCategory.id, { name: newCategoryName });
      toast.success("Category updated successfully!");
      setShowUpdatePopup(false);
      fetchCategories();
    } catch (error) {
      showError(error.response.data.code);
      toast.error("Failed to add category!");
    } finally {
      setLoading(false);
    }
  };

  // Delete a category
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const response = await deleteCategory(id);
          if (response.code.data === 1000) {
            toast.success("Category deleted successfully!");
            fetchCategories();
          }
        } catch (error) {
          showError(error.response.data.code);
          toast.error("Failed to delete category!");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.id.toString().includes(searchTerm)
  );

  // Filter
  const [sortOrder, setSortOrder] = useState("");
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortOrder === "id-asc") return a.id - b.id;
    if (sortOrder === "id-desc") return b.id - a.id;
    if (sortOrder === "name-asc") return a.name.localeCompare(b.name);
    if (sortOrder === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = sortedCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);

  return (
    <div className="category">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <LoadingOverlay />}
      <h1>Category</h1>
      <div className="category-list-header">
        <div className="title">
          Category list
          <div className="action">
            <input
              type="text"
              placeholder="Input category name or id ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="id-asc">By Id: Ascending</option>
              <option value="id-desc">By Id: Descending</option>
              <option value="name-asc">By name: A to Z</option>
              <option value="name-desc">By name: Z to A</option>
            </select>
          </div>
        </div>
        <div className="add">
          <button onClick={() => setShowAddPopup(true)}>Add a category</button>
        </div>
      </div>
      <div className="category-list-container">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Number of audiobooks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.audioBookCount}</td>
                <td className="action">
                  <button
                    className="update"
                    onClick={() => openUpdatePopup(category)}
                  >
                    Update
                  </button>
                  <button
                    className="delete"
                    onClick={() => {
                      if (category.audioBookCount > 0) {
                        showError(1004);
                        toast.error("Cannot delete category with audiobooks!");
                      } else {
                        handleDelete(category.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, Math.ceil(categories.length / itemsPerPage))
            )
          }
          disabled={currentPage === Math.ceil(categories.length / itemsPerPage)}
        >
          Next
        </button>
      </div>
      {/* Popup add a category */}
      {showAddPopup && (
        <div className="add-model-overplay">
          <div className="model">
            <h3>Add a category</h3>
            <input
              type="text"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <div className="model-buttons">
              <button onClick={handleAdd}>Save</button>
              <button onClick={() => setShowAddPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup update a category */}
      {showUpdatePopup && (
        <div className="update-model-overplay">
          <div className="model">
            <h3>Update the category</h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <div className="model-buttons">
              <button onClick={handleUpdate}>Confirm</button>
              <button onClick={() => setShowUpdatePopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
