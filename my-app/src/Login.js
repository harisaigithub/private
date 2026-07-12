import { useState } from "react";
import axios from "axios";
import { FaUserCircle, FaUser, FaLock } from "react-icons/fa";
import "./Login.css";

export default function Login() {

    const [staffNo, setStaffNo] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {

        try {

            const res = await axios.post(
                "http://localhost:5000/login",
                {
                    staffNo,
                    password
                }
            );

            alert("Login Successful");

            localStorage.setItem(
                "userId",
                res.data.userId
            );

            window.location.href="/upload";

        }

        catch{

            alert("Invalid Staff Number or Password");

        }

    };

    return(

        <div className="login-page">

            <div className="login-card">

                <div className="logo-circle">

                    <FaUserCircle/>

                </div>

                <h1 className="title">
                    Welcome to EMS
                </h1>

                <p className="subtitle">
                    Employee Management System
                </p>

                <div className="input-box">

                    <i>
                        <FaUser/>
                    </i>

                    <input
                        type="text"
                        placeholder="Staff Number"
                        value={staffNo}
                        onChange={(e)=>setStaffNo(e.target.value)}
                    />

                </div>

                <div className="input-box">

                    <i>
                        <FaLock/>
                    </i>

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />

                </div>

                <button
                    className="login-btn"
                    onClick={login}
                >
                    Login
                </button>

                <div className="footer">

                    © Employee Management System

                </div>

            </div>

        </div>

    );

}