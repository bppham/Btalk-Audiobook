import React from 'react';
import './Auth.css';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode'; // Cài thêm nếu cần decode token

const Auth = () => {
  const handleSuccess = (credentialResponse) => {
  const { credential } = credentialResponse;
  const decoded = jwtDecode(credential); // Giải mã JWT từ Google
  console.log("Thông tin người dùng:", decoded);

  // Gửi token về backend để xử lý xác thực
  fetch('http://localhost:8080/auth/client/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: credential }),
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);  // Backend trả về JWT mới hoặc thông tin người dùng
    // Lưu token vào localStorage hoặc sessionStorage nếu cần
    localStorage.setItem('jwtToken', data.token); // Ví dụ lưu token vào localStorage
  });
};

  const handleError = () => {
    console.error('Đăng nhập Google thất bại');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Đăng nhập</h2>
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </div>
    </div>
  );
};

export default Auth;
