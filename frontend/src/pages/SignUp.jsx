import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import helloword from '../images/helloword.png'
import logo from '../images/logo.png'
import { api_base_url } from '../hider';
const SignUp = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();
    setError(""); // Reset error message
  
    fetch(`${api_base_url}/signup`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        name: name,
        email: email,
        password: password
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === true) {
          alert("Account created successfully");
          navigate("/login"); 
        } else {
          setError(data.message || "Signup failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error during signup:", error);
        setError("An error occurred. Please try again later.");
      });
  };



  return (
    <>
    <div className=" container min-h-screen w-screen flex items-center justify-between ">
      <div className="left w-[40%] ml-10 ">
        <div className="logo  "><img src={logo} alt="" className='h-24' /></div>
      <form action="" onSubmit={submitForm}>
        <div className='inputbox'>
        <input type="text" onChange={(e)=>{setUsername(e.target.value)}} value={username} placeholder ="Username"  />
        </div>
        <div className='inputbox'>
        <input type="text" onChange={(e)=>{setName(e.target.value)}} value={name} placeholder ="Name"  />
        </div>
        <div className='inputbox'>
        <input type="email" onChange={(e)=>{setEmail(e.target.value)}} value={email} placeholder ="Email"  />
        </div>
        <div className='inputbox'>
        <input type="password" onChange={(e)=>{setPassword(e.target.value)}}  value={password} placeholder ="Password"  />
        </div>

    <p className='text-zinc-600'>Already have an account <Link to="/login" className='text-blue-400 '>login here</Link></p>
    <div className='inputbox bg-sky-500 mb-3 hover:bg-sky-800 '>
    <button type="submit" className="h-full w-full mt-[20px]">Sign Up</button>
        {/* <input type="submit" value='SignUp' className='cursor-pointer' /> */}
        </div>
         <p className='text-red-500 text-[14px] my-2'>{error}</p>
    </form>

      </div>
      <div className="right w-[55%] h-full ">
        <img src={helloword} alt="image" className='ml-3 h-[100vh] w-[100%] '/>
      </div>

    </div> 

    </>
  )
}


export default SignUp