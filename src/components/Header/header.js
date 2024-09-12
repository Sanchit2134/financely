import React, { useEffect } from "react";
import "./style.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import userImg from "../assets/user.svg";

const Header = () => {
  const [user] = useAuthState(auth);
  // console.log("User", user);  
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard"); 
    }
  }, [user, navigate]);

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged Out Successfully!");
      navigate("/");
    } catch (e) {
      console.error(e);
      toast.error(e.message);
    }
  };

  return (
    <div className="navbar">
      <p className="logo">Financely</p>
      {user && (
        <div className="user-info" style={{display:"flex", alignItems: "center", gap: "0.75rem"}}>
          <img className="user-img" src={user.photoURL ? user.photoURL : userImg} alt="user " 
          style={{borderRadius: "50%", width: "1.5rem", height: "1.5rem"}}/>
          <p className="logo-link" onClick={logout}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
};

export default Header;