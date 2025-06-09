import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Category from "./pages/Category/Category";
import AudioBookList from "./pages/AudioBook/AudioBookList/AudioBookList";
import AudioBookAdd from "./pages/AudioBook/AudioBookAdd/AudioBookAdd";
import AudioBookUpdate from "./pages/AudioBook/AudioBookUpdate/AudioBookUpdate";
import AudioBookDetail from "./pages/AudioBook/AudioBookDetail/AudioBookDetail";
import Author from "./pages/Author/Author";
import Voice from "./pages/Voice/Voice";
import EmployeeList from "./pages/Employee/EmployeeList/EmployeeList";
import EmployeeAdd from "./pages/Employee/EmployeeAdd/EmployeeAdd";
import EmployeeUpdate from "./pages/Employee/EmployeeUpdate/EmployeeUpdate";
import EmployeeDetail from "./pages/Employee/EmployeeDetail/EmployeeDetail";
import Login from "./pages/Authentication/Login/Login";
import ForgetPassword from "./pages/Authentication/ForgetPassword/ForgetPassword";
import VerifyCode from "./pages/Authentication/VerifyCode/VerifyCode";
import ResetPassword from "./pages/Authentication/ResetPassword/ResetPassword";
import Home from "./pages/Home/Home";
import RequireAuth from "./RequireAuth";
import RequireRole from "./RequireRole";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forget-password" element={<ForgetPassword />} />
        <Route path="/auth/verify-code" element={<VerifyCode />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route
          path="/*"
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/categories"
            element={
              <RequireRole allowedRoles={["ROLE_ADMIN", "ROLE_AUDIOBOOK"]}>
                <Category />
              </RequireRole>
            }
          />
          <Route
            path="/authors"
            element={
              <RequireRole allowedRoles={["ROLE_ADMIN", "ROLE_AUDIOBOOK"]}>
                <Author />
              </RequireRole>
            }
          />
          <Route
            path="/voices"
            element={
              <RequireRole allowedRoles={["ROLE_ADMIN", "ROLE_AUDIOBOOK"]}>
                <Voice />
              </RequireRole>
            }
          />
          <Route
            path="/audiobooks"
            element={
              <RequireRole allowedRoles={["ROLE_ADMIN", "ROLE_AUDIOBOOK"]}>
                <AudioBookList />
              </RequireRole>
            }
          />
          <Route
            path="/audiobooks/new-audiobook" 
            element={
              <RequireRole allowedRoles={["ROLE_ADMIN", "ROLE_AUDIOBOOK"]}>
                <AudioBookAdd />
              </RequireRole>
            }
          />
          <Route
            path="/audiobooks/update/:id"
            element={
              <RequireRole allowedRoles={["ROLE_ADMIN", "ROLE_AUDIOBOOK"]}>
                <AudioBookUpdate />
              </RequireRole>
            }
          />
          <Route
            path="/audiobooks/detail/:id"
            element={
              <RequireRole allowedRoles={["ROLE_ADMIN", "ROLE_AUDIOBOOK"]}>
                <AudioBookDetail />
              </RequireRole>
            }
          />

          <Route
            path="/employees" 
            element={
              <RequireRole allowedRoles={["ROLE_ADMIN", "ROLE_EMPLOYEE"]}>
                <EmployeeList />
              </RequireRole>
            }
          />
          <Route
            path="/employees/new-employee"
            element={
              <RequireRole allowedRoles={["ROLE_ADMIN", "ROLE_EMPLOYEE"]}>
                <EmployeeAdd />
              </RequireRole>
            }
          />
          <Route
            path="/employees/update/:id" 
            element={
              <RequireRole allowedRoles={["ROLE_ADMIN", "ROLE_EMPLOYEE"]}>
                <EmployeeUpdate />
              </RequireRole>
            }
          />
          <Route
            path="/employee/detail/:id" 
            element={
              <RequireRole allowedRoles={["ROLE_ADMIN", "ROLE_EMPLOYEE"]}>
                <EmployeeDetail />
              </RequireRole>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
