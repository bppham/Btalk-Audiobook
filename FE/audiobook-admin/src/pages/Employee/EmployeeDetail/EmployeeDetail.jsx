import React, { useEffect, useState } from 'react'
import './EmployeeDetail.css'
import {ToastContainer, toast} from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faX} from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useParams } from 'react-router-dom'
import { getEmployeeById } from '../../../services/EmployeeService'

const EmployeeDetail = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        roleNames: []
    })

    const [image, setImage] = useState(null);

    // Get employee by id
    const fetchData = async () => {
        try {
            const response = await getEmployeeById(id);
            console.log("📥 API Response:", response.data);
            setEmployee(response.data.result);
        } catch (error) {
            console.error("Error fetching employee: " + error);
        }
    };
    

    useEffect(() => {
        const fetchEmployee = async () => {
            await fetchData();
        };
        fetchEmployee();
    }, [id]);

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

    // Return image url
    const handleImageUrl = (url) => {
        return "http://localhost:8080/files/" + url;
    }

    // Show image at the beginning
    useEffect(() => {
        if (employee && employee.avatar) {
            const urlImage = handleImageUrl(employee.avatar)
          setImagePreview(urlImage);
        }
    }, [employee]);

    // Handel roles
    const getRoleString = (roles) => {
        if (!roles || roles.length === 0) return "";
        return roles.map(role => role).join(", ");
    };

  return (
    <div className='employee-detail'>
        <ToastContainer position="top-right" autoClose={3000} />
        <h1>Detail the employee</h1>
        <div className="form-detail-employee">
            <div className="row">
                <div className="item">
                    <label>Id</label>
                    <input type="text" name="id" value={employee.id} readOnly/>
                </div>
                <div className="item">
                    <label>Name</label>
                    <input type="text" name="name" value={employee.name} readOnly />
                </div>
            </div>
            <div className="row">
                <div className="item">
                    <label>Email</label>
                    <input type="text" name="email" value={employee.email} readOnly />
                </div>
                <div className="item">
                    <label>Phone Number</label>
                    <input type="text" name="phoneNumber" value={employee.phoneNumber} readOnly />
                </div>
            </div>
            <div className="row">
                <div className="item">
                    <label>Image</label>
                    {imagePreview && (
                    <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                    </div>
                )}
                </div>
                <div className="item">
                    <label>Roles</label>
                    <input type="text" value={getRoleString(employee.roleNames)} readOnly />
                </div>
                
            </div>
            <div className="row">
                
            </div>
        </div>
        <div className="action">
            <button onClick={() => navigate('/employees')}>Back</button>
        </div>
    </div>
  )
}

export default EmployeeDetail
