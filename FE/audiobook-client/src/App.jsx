import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home/Home";
import AudioBook from "./pages/AudioBook/AudioBook";
import Login from "./pages/Authentication/Login/Login";
import Register from "./pages/Authentication/Register/Register";
import Library from "./pages/Library/Library";
import History from "./pages/History/History";
import Ranking from "./pages/Ranking/Ranking";
import ForgetPassword from "./pages/Authentication/ForgetPassword/ForgetPassword";
import VerifyCode from "./pages/Authentication/VerifyCode/VerifyCode";
import ResetPassword from "./pages/Authentication/ResetPassword/ResetPassword";
import Search from "./pages/Search/Search";
import FilterCategory from "./pages/Filter/Category/FilterCategory";
import Account from "./pages/Account/Account";


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
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Route có layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<AudioBook />} />
          <Route path="/library" element={<Library />} />
          <Route path="/history" element={<History />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/search" element={<Search />} />
          <Route path="/category/:categoryId" element={<FilterCategory />} />
          <Route path="/account" element={<Account />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
