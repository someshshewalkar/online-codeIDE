import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import helloword from "../images/helloword.png";
import logo from "../images/logo.png";
import { api_base_url } from "../hider";
const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api_base_url}/login`, {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and userId in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("userId", data.userId);
        // Optionally, navigate to a protected route
        setTimeout(() => {
          window.location.href = "/";
        }, 200);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to login. Please try again.");
      console.error("Login Error:", err);
    }
  };

  return (
    <>
      <div className=" container min-h-screen w-screen flex items-center justify-between ">
        <div className="left w-[40%] ml-10 ">
          <div className="logo  ">
            <img src={logo} alt="" className="h-24" />
          </div>
          <form action="" onSubmit={submitForm}>
            <div className="inputbox">
              <input
                type="email"
                onChange={(e) => {
                  setemail(e.target.value);
                }}
                value={email}
                placeholder="Email"
              />
            </div>
            <div className="inputbox">
              <input
                type="password"
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                value={password}
                placeholder="Password"
              />
            </div>

            <p className="text-zinc-600">
              Haven't an account{" "}
              <Link to="/signup" className="text-blue-400 ">
                SignUp here
              </Link>
            </p>
            <div className="inputbox bg-sky-500 mb-3 hover:bg-sky-800">
              <button type="submit" className="h-full w-full mt-[20px]">
                Sign Up
              </button>
            </div>

            <p className="text-red-500 text-[14px] my-2">{error}</p>
          </form>
        </div>
        <div className="right w-[55%] h-full ">
          <img
            src={helloword}
            alt="image"
            className="ml-3 h-[100vh] w-[100%] "
          />
        </div>
      </div>
    </>
  );
};

export default Login;
