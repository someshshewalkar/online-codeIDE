import React from "react";
import logo from "../images/logo.png";
import { LuDownload } from "react-icons/lu";

const EditorNav = () => {
  return (
    <>
      <div className="editornavabar p-2 flex justify-between items-center bg-slate-500 w-full">
        <div className="logo ">
          <img src={logo} alt="" className="h-24 " />
        </div>
        <div className="title text-2xl">
          file/ <span className="text-zinc-400">My first Project</span>
        </div>
        <i className=" down text-2xl rounded-sm bg-black p-2 cursor-pointer">
          <LuDownload />
        </i>
      </div>
    </>
  );
};

export default EditorNav;
