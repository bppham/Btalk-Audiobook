import './App.css'
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './pages/Home/Home';
import AudioBook from './pages/AudioBook/AudioBook';
import Login from './pages/Authentication/Login/Login';
import Register from './pages/Authentication/Register/Register'

function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Sidebar />
        <Outlet /> {/* Đây là nơi render Home / AudioBook */}
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Route có layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<AudioBook />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
