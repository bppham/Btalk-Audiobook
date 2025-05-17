import React, { useEffect, useState } from 'react'
import './Voice.css'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { addVoice, deleteVoice, listVoices, updateVoice } from '../../services/VoiceService';

const Voice = () => {

    // Show list voice
    const [voices, setVoices] = useState([]);

    const fetchVoices = async () => {
        try {
            const response = await listVoices();
            setVoices(response.data.result);
        } catch (error) {
            console.error("Error fetching voices:", error);
            toast.error("Failed to load voices!");
        }
    }

    useEffect(() => {
        fetchVoices();
    }, []);

    const showError = (errorCode) =>{
                let title = "Lỗi!";
                let text = "Đã xảy ra lỗi. Vui lòng thử lại.";
                let icon = "error";
            
                switch (errorCode) {
                    case 1000:
                    break;
                case 3001:
                    text = "Giọng đọc đã có!";
                    break;
                case 3002:
                    text = "Tên giọng đọc không được để trống.";
                    break;
                case 3003:
                    text = "Không tìm thấy giọng đọc!";
                    break;
                case 3004:
                    text = "Giọng đọc vẫn còn sách nói!";
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
    

    // Add a voice
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [voiceName, setVoiceName] = useState("");   

    const handleAdd = async () =>{
        if(!voiceName.trim()) {
            showError(3002);
            return;
        }
        try {
            const response = await addVoice({name: voiceName});
            setVoices([...voices, response.data.result]); // update the voice list
            setVoiceName("");
            setShowAddPopup(false);
            toast.success("Voice added successfully!");
        } catch (error) {
            showError(error.response.data.code);
            toast.error("Failed to add voice!"); 
        }
    }
    
    // Update a voice
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [selectedVoice, setSeletedVoice] = useState(null);
    const [newVoiceName, setNewVoiceName] = useState("");

    const openUpdatePopup = (voice) => {
        setSeletedVoice(voice);
        setNewVoiceName(voice.name);
        setShowUpdatePopup(true);
    };

    const handleUpdate = async () =>{
        if(!newVoiceName.trim()){
            showError(3002)
            return;
        }
        try {
            await updateVoice(selectedVoice.id, {name: newVoiceName});
            toast.success("Voice updated successfully!");
            setShowUpdatePopup(false);
            fetchVoices();
        } catch (error) {
            showError(error.response.data.code);
            toast.error("Failed to update voice!");
        }
    }

    // Delete a voice
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
                    await deleteVoice(id);
                    toast.success("Voice deleted successfully!");
                    fetchVoices();
                } catch (error) {
                    showError(error.response.data.code);
                }
            }
        });
    };


    // Search
    const [searchTerm, setSearchTerm] = useState("");
    const filteredVoices = voices.filter(voice =>
        voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voice.id.toString().includes(searchTerm)
    );

    // Filter
    const [sortOrder, setSortOrder] = useState("");  
    const sortedVoices = [...filteredVoices].sort((a, b) => {
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
    const currentVoices = sortedVoices.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedVoices.length / itemsPerPage);

  return (
    <div className='voice'>
        <ToastContainer position="top-right" autoClose={3000} />
        <h1>Voice</h1>
        <div className="voice-list-header">
            <div className="title">
                Voice list
                <div className="action">
                    <input
                        type="text"
                        placeholder="Input voice name or id ..."
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
                <button onClick={() => setShowAddPopup(true)}>Add a voice</button>
            </div>
        </div>
        <div className="voice-list-container">
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
                    {currentVoices.map(voice => (
                        <tr key={voice.id}>
                            <td>{voice.id}</td>
                            <td>{voice.name}</td>
                            <td>{voice.audioBookCount}</td>
                            <td className='action'>
                                <button className='update' onClick={() => openUpdatePopup(voice)}>Update</button>
                                <button 
                                    className='delete' 
                                    onClick={() => {
                                        if (voice.audioBookCount > 0) {
                                            showError(3004);
                                        } else {
                                            handleDelete(voice.id);
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
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(voices.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(voices.length / itemsPerPage)}
                >
                    Next
            </button>
        </div>
        {/* Popup add a voice */}
        {showAddPopup && (
            <div className="add-model-overplay">
                <div className="model">
                    <h3>Add a voice</h3>
                    <input type="text" placeholder='Enter voice name'
                    value={voiceName} 
                    onChange={(e) => setVoiceName(e.target.value)}
                    />
                    <div className="model-buttons">
                        <button onClick={handleAdd}>Save</button>
                        <button onClick={() => setShowAddPopup(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        )}

        {/* Popup update a voice */}
        {showUpdatePopup && (
            <div className="update-model-overplay">
                <div className="model">
                    <h3>Update the voice</h3>
                    <input type="text"
                    value={newVoiceName} 
                    onChange={(e) => setNewVoiceName(e.target.value)}
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

export default Voice
