import React, { useState, useEffect, useRef } from "react";
import "./EmployeeAdd.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { addEmployee, listRole } from "../../../services/EmployeeService";
import { uploadAvatar } from "../../../services/Upload";
import LoadingOverlay from "../../../../../audiobook-client/src/components/LoadingOverlay/LoadingOverlay";
const EmployeeAdd = () => {
  const navigate = useNavigate();
  const defaultImage =
    "https://res.cloudinary.com/dkcpxrkr3/image/upload/v1748250537/default-avatar-icon-of-social-media-user-vector_gzsm2f.jpg";
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    roleIds: [],
    avatar: "",
  });

  const [loading, setLoading] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef();

  const handleButtonClick = () => {
    fileInputRef.current.click(); // kích hoạt input ẩn
  };

  // Handle input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Preview Image
  const [imagePreview, setImagePreview] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setAvatarFile(null);
      setImagePreview(defaultImage);
    }
  };

  // Handel roles
  const [allRoles, setAllRoles] = useState([]);
  const fetchRoles = async () => {
    try {
      const response = await listRole();
      if (response.data.code === 1000) {
        setAllRoles(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to load roles!");
    }
  };
  useEffect(() => {
    fetchRoles();
  }, []);

  const handleRolesChange = (event) => {
    const roleId = Number(event.target.value);

    setEmployee((prev) => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter((id) => id !== roleId) // Bỏ nếu đã có
        : [...prev.roleIds, roleId], // Thêm nếu chưa có
    }));
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let photoURL = null;
    if (avatarFile) {
      const response = await uploadAvatar(avatarFile);
      if (response.data.code === 1000) {
        photoURL = response.data.result.url;
      }
    }
    // Giữ roles là danh sách string
    const requestEmployee = {
      ...employee,
      roleIds: employee.roleIds,
      avatar: photoURL,
    };

    const response = await addEmployee(requestEmployee);
    if (response.data.code === 1000) {
      toast.success("Add employee successfully");
      setTimeout(() => {
        navigate("/employees");
      }, 3000);
    } else {
      toast.error("Failed to add employee");
    }
    setLoading(false);
  };

  return (
    <div className="employee-add">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <LoadingOverlay />}
      <h1>Add an employee</h1>
      <div className="form-add-employee">
        <div className="row">
          <div className="item">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={employee.name}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="item">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={employee.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="item">
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={employee.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="item">
            <label>Avatar</label>
            <button
              className="btn-choose-avatar"
              type="button"
              onClick={handleButtonClick}
            >
              Choose image
            </button>
            <input
              type="file"
              name="image"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>
        <div className="row">
          <label>Roles</label>
          <table className="role-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Role Name</th>
                <th>Role Description</th>
              </tr>
            </thead>
            <tbody>
              {allRoles.map((role) => (
                <tr key={role.id}>
                  <td>
                    <input
                      type="checkbox"
                      value={role.id}
                      onChange={handleRolesChange}
                    />
                  </td>
                  <td>{role.name}</td>
                  <td>{role.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="action">
        <button onClick={handleSubmit}>Save</button>
        <button onClick={() => navigate("/employees")}>Cancel</button>
      </div>
    </div>
  );
};

export default EmployeeAdd;
