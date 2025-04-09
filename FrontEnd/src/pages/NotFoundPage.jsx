import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div style={{ marginTop: "200px", textAlign: "center" }}>
      <h1 style={{ fontSize: "80px", fontWeight: "bold" }}>404</h1>
      <h2 style={{ fontSize: "30px", fontWeight: "bold" }}>Not Found Page</h2>
      <Link to="/" style={{ fontSize: "20px", fontWeight: "bold" }}>
        Go back Home Page
      </Link>
    </div>
  );
};

export default NotFoundPage;
