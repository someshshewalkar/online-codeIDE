import React, { useState } from "react";
import code from "../images/code.png";
import delete1 from "../images/delete1.png";
import { api_base_url } from "../hider";
import { useNavigate } from "react-router-dom";

const Grid = ({ item }) => {
  const [isDeleteModelShow, setIsDeleteModelShow] = useState(false);
  const navigate = useNavigate();
  const deleteProj = (id) => {
    fetch(api_base_url + "/deleteProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        progId: id,
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsDeleteModelShow(false);
          window.location.reload();
        } else {
          alert(data.message);
          setIsDeleteModelShow(false);
        }
      });
  };
  return (
    <>
      <div className="grid w-64 h-48 bg-zinc-800 rounded-lg m-3">
        <div
          onClick={() => {
            navigate(`/editor/${item._id}`);
          }}
          className="logo 1"
        >
          <img src={code} alt="image" className="w-24 h-24" />
          <div className="flex justify-between">
            <div className="p-2">
              <h2 className="text-2xl">{item.title}</h2>
              <p className="text-sm mt-2">
                Created on {new Date(item.date).toDateString()}
              </p>
            </div>

            <div>
              <img
                onClick={() => {
                  setIsDeleteModelShow(true);
                }}
                src={delete1}
                alt="deleteimage"
                className="w-8 h-8 m-5 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
      {isDeleteModelShow ? (
        <div className="model fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.1)] flex justify-center items-center flex-col">
          <div className="mainModel w-[25vw] h-[25vh] bg-[#141414] rounded-lg p-[20px]">
            <h3 className="text-3xl">
              Do you want to delete <br />
              this project
            </h3>
            <div className="flex w-full mt-5 items-center gap-[10px]">
              <button
                onClick={() => {
                  deleteProj(item._id);
                }}
                className="p-[10px] rounded-lg bg-[#FF4343] text-white cursor-pointer min-w-[49%]"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setIsDeleteModelShow(false);
                }}
                className="p-[10px] rounded-lg bg-[#1A1919] text-white cursor-pointer min-w-[49%]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Grid;
