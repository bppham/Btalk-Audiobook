import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar'
import Category from './pages/Category/Category';
import AudioBookList from './pages/AudioBook/AudioBookList/AudioBookList';
import AudioBookAdd from './pages/AudioBook/AudioBookAdd/AudioBookAdd';
import AudioBookUpdate from './pages/AudioBook/AudioBookUpdate/AudioBookUpdate';
import AudioBookDetail from './pages/AudioBook/AudioBookDetail/AudioBookDetail';
import Author from './pages/Author/Author';
import Voice from './pages/Voice/Voice';
import EmployeeList from './pages/Employee/EmployeeList/EmployeeList';
import EmployeeAdd from './pages/Employee/EmployeeAdd/EmployeeAdd';
import EmployeeUpdate from './pages/Employee/EmployeeUpdate/EmployeeUpdate';
import EmployeeDetail from './pages/Employee/EmployeeDetail/EmployeeDetail';
import Login from './pages/Authentication/Login/Login';
import ForgetPassword from './pages/Authentication/ForgetPassword/ForgetPassword';
import VerifyCode from './pages/Authentication/VerifyCode/VerifyCode'
import ResetPassword from './pages/Authentication/ResetPassword/ResetPassword'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/forget-password" element={<ForgetPassword />} />
                <Route path="/auth/verify-code" element={<VerifyCode />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/*" element={<MainLayout />} />
            </Routes>
        </Router>
    );
}

function MainLayout() {
  return (
    <>
        <Navbar/>
        <div className="container">
            <Sidebar/>
            <Routes>
              <Route path = "/categories" element={<Category/>}/>
              <Route path = "/authors" element={<Author/>}/>
              <Route path = "/voices" element={<Voice/>}/>

              <Route path = "/audiobooks" element={<AudioBookList/>}/>
              <Route path = "/audiobooks/new-audiobook" element={<AudioBookAdd/>}/>
              <Route path = "/audiobooks/update/:id" element={<AudioBookUpdate/>}/>
              <Route path = "/audiobooks/detail/:id" element={<AudioBookDetail/>}/>

              <Route path = "/employees" element={<EmployeeList/>}/>
              <Route path = "/employees/new-employee" element={<EmployeeAdd/>}/>
              <Route path = "/employees/update/:id" element={<EmployeeUpdate/>}/>
              <Route path = "/employee/detail/:id" element={<EmployeeDetail/>}/>
              
            </Routes>
        </div>

    </>
  )
}

export default App