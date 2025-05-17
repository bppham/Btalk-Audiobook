import React, { useEffect, useState } from 'react'
import './Author.css'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { addAuthor, deleteAuthor, listAuthors, updateAuthor } from '../../services/AuthorService';

const Author = () => {

    // Show list authors
    const [authors, setAuthors] = useState([]);

    const fetchAuthors = async () => {
        try {
            const response = await listAuthors();
            setAuthors(response.data.result);
        } catch (error) {
            console.error("Error fetching authors:", error);
            toast.error("Failed to load authors!");
        }
    }

    useEffect(() => {
        fetchAuthors();
    }, []);

    const showError = (errorCode) =>{
            let title = "Lỗi!";
            let text = "Đã xảy ra lỗi. Vui lòng thử lại.";
            let icon = "error";
        
            switch (errorCode) {
                case 1000:
                break;
            case 2001:
                text = "Tên tác giả đã có!";
                break;
            case 2002:
                text = "Tên tác giả không được để trống.";
                break;
            case 2003:
                text = "Không tìm thấy tác giả!";
                break;
            case 2004:
                text = "Tác giả vẫn còn sách nói!";
                break;
            case 9998:
                text = "Lỗi hệ thống! Vui lòng thử lại sau.";
                break;
            case 9999:
                text = "Lỗi dữ liệu hoặc yêu cầu không hợp lệ.";
                break;
            default:
                text = `Lỗi không xác định (${errorCode}). Vui lòng thử lại.`;
            }
        
            Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: "OK",
            });
        }

    // Add an author
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [authorName, setAuthorName] = useState("");   

    const handleAddAuthor = async () =>{
        if(!authorName.trim()) {
            showError(2002);
            return;
        }
        try {
            const response = await addAuthor({name: authorName});
            setAuthors([...authors, response.data.result]); // update the author list
            setAuthorName("");
            setShowAddPopup(false);
            toast.success("Author added successfully!");
        } catch (error) {
            showError(error.response.data.code);
            toast.error("Failed to add author!"); 
        }
    }
    
    // Update an author
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [selectedAuthor, setSeletedAuthor] = useState(null);
    const [newAuthorName, setNewAuthorName] = useState("");

    const openUpdatePopup = (author) => {
        setSeletedAuthor(author);
        setNewAuthorName(author.name);
        setShowUpdatePopup(true);
    };

    const handleUpdate = async () =>{
        if(!newAuthorName.trim()){
            showError(2002);
            return;
        }
        try {
            await updateAuthor(selectedAuthor.id, {name: newAuthorName});
            toast.success("Author updated successfully!");
            setShowUpdatePopup(false);
            fetchAuthors();
        } catch (error) {
            showError(error.response.data.code);
            toast.error("Failed to update author!");
        }
    }

    // Delete an author
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteAuthor(id);
                    toast.success("Author deleted successfully!");
                    fetchAuthors();
                } catch (error) {
                    showError(error.response.data.code);
                    toast.error("Failed to delete author!");
                }
            }
        });
    };


    // Search
    const [searchTerm, setSearchTerm] = useState("");
    const filteredAuthors = authors.filter(author =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        author.id.toString().includes(searchTerm)
    );

    // Filter
    const [sortOrder, setSortOrder] = useState("");  
    const sortedAuthors = [...filteredAuthors].sort((a, b) => {
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
    const currentAuthors = sortedAuthors.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedAuthors.length / itemsPerPage);

  return (
    <div className='author'>
        <ToastContainer position="top-right" autoClose={3000} />
        <h1>Author</h1>
        <div className="author-list-header">
            <div className="title">
                Author list
                <div className="action">
                    <input
                        type="text"
                        placeholder="Input author name or id ..."
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
                <button onClick={() => setShowAddPopup(true)}>Add a author</button>
            </div>
        </div>
        <div className="author-list-container">
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
                    {currentAuthors.map(author => (
                        <tr key={author.id}>
                            <td>{author.id}</td>
                            <td>{author.name}</td>
                            <td>{author.audioBookCount}</td>
                            <td className='action'>
                                <button className='update' onClick={() => openUpdatePopup(author)}>Update</button>
                                <button 
                                    className='delete' 
                                    onClick={() => {
                                        if (author.audioBookCount > 0) {
                                            showError(2004);
                                            toast.error("Cannot delete author with audiobooks!");
                                        } else {
                                            handleDelete(author.id);
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
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}>
                Prev
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(authors.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(authors.length / itemsPerPage)}
                >
                    Next
            </button>
        </div>
        {/* Popup add a author */}
        {showAddPopup && (
            <div className="add-model-overplay">
                <div className="model">
                    <h3>Add a author</h3>
                    <input type="text" placeholder='Enter author name'
                    value={authorName} 
                    onChange={(e) => setAuthorName(e.target.value)}
                    />
                    <div className="model-buttons">
                        <button onClick={handleAddAuthor}>Save</button>
                        <button onClick={() => setShowAddPopup(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        )}

        {/* Popup update a author */}
        {showUpdatePopup && (
            <div className="update-model-overplay">
                <div className="model">
                    <h3>Update the author</h3>
                    <input type="text"
                    value={newAuthorName} 
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    />
                    <div className="model-buttons">
                        <button onClick={handleUpdate}>Confirm</button>
                        <button onClick={() => setShowUpdatePopup(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default Author
