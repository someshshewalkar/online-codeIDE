import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "/src/App.css";
import Grid from "../components/Grid";
import List from "../components/List";
import { api_base_url } from "../hider";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const [projTitle, setProjTitle] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data
    ? data.filter(
        (item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()) // Case insensitive filtering
      )
    : [];

  const createProj = (e) => {
    if (projTitle == "") {
      alert("please enter title");
    } else {
      fetch(api_base_url + "/createProj", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: projTitle,
          userId: localStorage.getItem("userId"),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setIsCreateModelShow(false);
            setProjTitle("");
            alert("Project Created Succesfully");
            navigate(`/editor/${data.projectId}`);
          }
        });
    }
  };

  const getProj = () => {
    fetch(api_base_url + "/getProjects", {
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
          setData(data.projects);
        } else {
          setError(data.message);
        }
      });
  };

  useEffect(() => {
    getProj();
  }, []);
  const [userdata, setUserData] = useState(null);
  const [usererror, setUserError] = useState("");

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
          setUserData(data.user);
        } else {
          setUserError(data.message);
        }
      });
  }, []);

  const [grid, setgrid] = useState(false);

  return (
    <>
      <Navbar grid={grid} setgrid={setgrid} />
      <div>
        <div className="p-3 flex justify-between">
          <h2 className="text-2xl p-5">
            Hey {userdata ? `${userdata.username}` : "there"}👋
          </h2>
          <div className="inputbox w-96 flex gap-1">
            <input
              type="text"
              placeholder="Search your project"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
            <button
              className="inputbox bg-sky-500 mb-3 hover:bg-sky-800 !w-14 h-12 rounded-lg"
              onClick={() => {
                setIsCreateModelShow(true);
              }}
            >
              +
            </button>
          </div>
        </div>
        <div className="cards">
          {grid ? (
            <div className="flex flex-wrap gap-2">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <Grid key={index} item={item} />
                ))
              ) : (
                <p>No projects found</p>
              )}

              {/* <Grid /> */}
            </div>
          ) : (
            <div>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <List key={index} item={item} />
                ))
              ) : (
                <p>No projects found</p>
              )}
              {/* <List/> */}
            </div>
          )}
        </div>
      </div>
      {isCreateModelShow && (
        <div className="createModelCon fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-[rgb(0,0,0,0.1)] flex items-center justify-center">
          <div className="createModel w-[25vw] h-[27vh] shadow-lg shadow-black/50 bg-[#141414] rounded-[10px] p-[20px]">
            <h3 className="text-2xl">Create New Project</h3>
            <div className="inputbox !bg-[#202020] mt-4">
              <input
                onChange={(e) => {
                  setProjTitle(e.target.value);
                }}
                value={projTitle}
                type="text"
                placeholder="Project Title"
              />
            </div>
            <div className="flex items-center gap-[10px] w-full mt-2">
              <button
                onClick={createProj}
                className=" bg-blue-600 rounded-[5px] w-[49%] mb-4 !p-[5px] !px-[10px] !py-[10px]"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreateModelShow(false);
                }}
                className="btnBlue !bg-[#1A1919] rounded-[5px] mb-4 w-[49%] !p-[5px] !px-[10px] !py-[10px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
