import React, { useEffect, useState } from 'react'
import './EmployeeList.css'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import {Link, useNavigate} from 'react-router-dom'
import { deleteEmployee, listEmployee } from '../../../services/EmployeeService';

const EmployeeList = () => {
    const navigate = useNavigate();

    // Show list employee
    const [employees, setEmployees] = useState([]);

    const fetchEmployee = async () => {
        try {
            const response = await listEmployee();
            setEmployees(response.data.result);
        } catch (error) {
            console.error("Error fetching employees:", error);
            toast.error("Failed to load employees!");
        }
    }

    useEffect(() => {
        fetchEmployee();
    }, []);

    // Preview Image
    const [imagePreview, setImagePreview] = useState(null);
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };
    // Delete a employee
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this employee!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteEmployee(id);
                    toast.success("Employee deleted successfully!");
                    fetchEmployee();
                } catch (error) {
                    toast.error("Failed to delete Employee!");
                }
            }
        });
    };

    // Search
    const [searchTerm, setSearchTerm] = useState("");
    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.id.toString().includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) 
    )

    // Filter
    const [sortOrder, setSortOrder] = useState("");  
    const sortedEmployees = [...filteredEmployees].sort((a, b) => {
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
    const currentEmployees = sortedEmployees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

  return (
    <div className='employee-list'>
        <ToastContainer position="top-right" autoClose={3000} />
        <h1>Employee</h1>
        <div className="employee-list-header">
            <div className="title">
                Employee list
                <div className="action">
                    <input
                        type="text"
                        placeholder="Input employee name or id ..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}   
                    />
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="">Sort by</option>
                        <option value="id-asc">By Id: Ascending</option>
                        <option value="id-desc">By Id: Descending</option>
                        <option value="name-asc">By name: A to Z</option>
                        <option value="name-desc">By name: Z to A</option>     
                    </select>
                </div>
            </div>
            <div className="add">
                <button onClick={() => navigate('/employees/new-employee')}>Add New Employee</button>
            </div>
        </div>
        <div className="employee-list-container">
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEmployees.map(employee => (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>
                                <img src={employee.avatar} alt="" />
                            </td>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.phoneNumber}</td>
                            <td >
                                <div className="action">
                                    <button onClick={() => navigate(`/employees/update/${employee.id}`)}>Update</button>
                                    <button onClick={() => {handleDelete(employee.id) }}>
                                        Delete
                                    </button>
                                    <button onClick={() => navigate(`/employee/detail/${employee.id}`)}>Detail</button>
                                </div>
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="pagination">
            <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}>
                Prev
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(employees.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(employees.length / itemsPerPage)}
                >
                    Next
            </button>
        </div>
    </div>
  )
}

export default EmployeeList
