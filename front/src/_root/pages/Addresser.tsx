import { isAuthenticated, logout } from "@/jwt_back/work";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Addresser = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/home");
    } else {
      navigate("/sign-in");
    }
  }, [navigate]);

  return <div></div>;
};

export default Addresser;
