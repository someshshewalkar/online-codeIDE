import React, { useState, useEffect } from "react";
import logo from "../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "react-avatar";
import { MdOutlineLightMode } from "react-icons/md";
import { IoGridOutline } from "react-icons/io5";
import { api_base_url, toggleClass } from "../hider";

const Navbar = ({ grid, setgrid }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(api_base_url + "/getuserDetails", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setData(data.user);
        } else {
          setError(data.message);
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    window.location.reload();
  };
  

  return (
    <>
      <div className="navabr p-2 flex justify-between space-x-1 bg-slate-500 w-full">
        <div className="logo ">
          <img src={logo} alt="" className="h-24 " />
        </div>
        <div className="links py-5 space-x-2 font-bold ">
          <Link>Home</Link>
          <Link>About</Link>
          <Link>ContactUs</Link>
          <Link>Services</Link>
          {/* <button onClick={logout} className=' rounded-md !bg-red-500 min-w-[100px] ml-2 hover:!bg-red-600'>Logout</button> */}
          {/* <button>Logout</button> */}
          <Avatar
            name={data ? data.name : "Guest"}
            size="50"
            className="rounded-full cursor-pointer"
            onClick={() => {
              toggleClass(".togglemenu", "hidden");
            }}
          />
        </div>
      </div>

      <div className="togglemenu hidden bg-zinc-700 w-40 h-44 p-3 absolute right-5 top-[80px] rounded-lg">
        <h1 className="text-2xl">{data ? data.name : ""}</h1>
        <div className="flex gap-2 items-center flex-col  mt-5">
          <i
            className="flex items-center gap-2 mt-3  cursor-pointer"
            style={{ fontStyle: "normal" }}
          >
            <MdOutlineLightMode className="text-[20px]" /> Light mode
          </i>
          <i
            onClick={() => setgrid(!grid)}
            className="flex items-center gap-2  mb-2 cursor-pointer"
            style={{ fontStyle: "normal" }}
          >
            <IoGridOutline className="text-[20px]" /> {grid ? "Grid" : "List"}{" "}
            layout
          </i>
        </div>
        <button
          onClick={logout}
          className=" rounded-md !bg-red-500 min-w-[100px] ml-2 hover:!bg-red-600"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Navbar;
