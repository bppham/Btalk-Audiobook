import React from "react";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="forbidden-container">
      <h1>Not Found</h1>
      <p>You may have access the wrong page.</p>
      <a href="/">
        <button>Go back to Home</button>
      </a>
    </div>
  );
};

export default NotFound;
