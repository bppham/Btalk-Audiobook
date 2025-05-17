import React, { useState, useEffect } from "react";
import "./EmployeeAdd.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { addEmployee, listRole } from "../../../services/EmployeeService";
const EmployeeAdd = () => {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    roleIds: [],
  });

  const [image, setImage] = useState(null);

  // Handle input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Preview Image
  const [imagePreview, setImagePreview] = useState(null);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setImage(file);
    }
  };

  // Handel categories
  const [allRoles, setAllRoles] = useState([]);
  const fetchRoles = async () => {
    try {
      const response = await listRole();
      console.log(response);
      setAllRoles(response.data.result);
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

    // Giữ roles là danh sách string
    const formattedEmployee = {
      ...employee,
      roleIds: employee.roleIds // Gửi danh sách string, không phải object
    };

    const formData = new FormData();
    formData.append(
      "employee",
      new Blob([JSON.stringify(formattedEmployee)], {
        type: "application/json",
      })
    );

    if (image) formData.append("avatar", image);

    try {
      await addEmployee(formData);
      toast.success("Employee added successfully!");
      navigate("/employees");
    } catch (error) {
      toast.error("Failed to add employee!");
      console.error(error);
    }
  };

  return (
    <div className="employee-add">
      <ToastContainer position="top-right" autoClose={3000} />
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
            <input
              type="file"
              name="image"
              id=""
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
