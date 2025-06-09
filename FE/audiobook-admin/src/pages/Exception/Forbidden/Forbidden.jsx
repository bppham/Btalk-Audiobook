import React from "react";
import "./Forbidden.css";

const Forbidden = () => {
  return (
    <div className="forbidden-container">
      <h1>You do not have permission to access this page</h1>
      <p>Please leave or contact with administrator if it is a mistake.</p>
      <a href="/">
        <button>Go back to Home</button>
      </a>
    </div>
  );
};

export default Forbidden;
