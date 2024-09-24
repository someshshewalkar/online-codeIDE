import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { MdLightMode } from "react-icons/md";
import { FaExpandAlt } from "react-icons/fa";
import EditorNav from "../components/EditorNav";
import { useParams } from "react-router-dom";
import { api_base_url } from "../hider";

const Editorr = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tab, setTab] = useState("html");
  const [isLight, setIsLight] = useState(false);
  const [htmlCode, setHtmlCode] = useState("<h1>Hello world</h1>");
  const [cssCode, setCssCode] = useState("body { background-color: #f4f4f4; }");
  const [jsCode, setJsCode] = useState("// some comment");

  const { projectID } = useParams();

  const changeTheme = () => {
    if (isLight) {
      document.querySelector(".editornavabar").style.backgroundColor =
        "#64748b";
      document.body.classList.remove("lightMode");
      setIsLight(false);
    } else {
      document.querySelector(".editornavabar").style.backgroundColor = "white";
      document.body.classList.add("lightMode");
      setIsLight(true);
    }
  };

  const run = () => {
    const html = htmlCode;
    const css = `<style>${cssCode}</style>`;
    const js = `<script>${jsCode}</script>`;
    const iframe = document.getElementById("iframe");

    if (iframe) {
      iframe.srcdoc = html + css + js;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      run();
    }, 200);
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    fetch(api_base_url + "/getproject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        projId: projectID,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setHtmlCode(data.project.htmlCode);
        setCssCode(data.project.cssCode);
        setJsCode(data.project.jsCode);
      });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault(); // Prevent the default save file dialog

        // Ensure that projectID and code states are updated and passed to the fetch request
        fetch(api_base_url + "/updateProject", {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            projId: projectID, // Make sure projectID is correct
            htmlCode: htmlCode, // Passing the current HTML code
            cssCode: cssCode, // Passing the current CSS code
            jsCode: jsCode, // Passing the current JS code
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              alert("Project saved successfully");
            } else {
              alert("Something went wrong");
            }
          })
          .catch((err) => {
            console.error("Error saving project:", err);
            alert("Failed to save project. Please try again.");
          });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [projectID, htmlCode, cssCode, jsCode]);

  return (
    <>
      <EditorNav />
      <div className="flex">
        <div className={`left ${isExpanded ? "w-full" : "w-1/2"} min-h-screen`}>
          <div className="tabs flex gap-4 px-10 py-3 justify-between">
            <div
              className="tab bg-zinc-700 rounded-sm cursor-pointer px-10 py-1"
              onClick={() => setTab("html")}
            >
              HTML
            </div>
            <div
              className="tab bg-zinc-700 rounded-sm cursor-pointer px-10 py-1"
              onClick={() => setTab("css")}
            >
              CSS
            </div>
            <div
              className="tab bg-zinc-700 rounded-sm cursor-pointer px-10 py-1"
              onClick={() => setTab("js")}
            >
              JavaScript
            </div>
            <div className="icon flex gap-3 items-center p-2 rounded-sm">
              <i className="cursor-pointer" onClick={changeTheme}>
                <MdLightMode />
              </i>
              <i
                className="cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <FaExpandAlt />
              </i>
            </div>
          </div>
          <div>
            {tab === "html" ? (
              <Editor
                onChange={(value) => {
                  setHtmlCode(value || "");
                  run();
                }}
                height="82vh"
                theme={isLight ? "vs-light" : "vs-dark"}
                language="html"
                value={htmlCode}
              />
            ) : tab === "css" ? (
              <Editor
                onChange={(value) => {
                  setCssCode(value || "");
                  run();
                }}
                height="82vh"
                theme={isLight ? "vs-light" : "vs-dark"}
                language="css"
                value={cssCode}
              />
            ) : (
              <Editor
                onChange={(value) => {
                  setJsCode(value || "");
                  run();
                }}
                height="82vh"
                theme={isLight ? "vs-light" : "vs-dark"}
                language="javascript"
                value={jsCode}
              />
            )}
          </div>
        </div>
        {!isExpanded && (
          <iframe
            id="iframe"
            className="w-[50%] min-h-[82vh] bg-[#fff] text-black"
            title="output"
          />
        )}
      </div>
    </>
  );
};

export default Editorr;
