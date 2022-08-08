import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../context/Context';
import './login.css';

const Login = () => {
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const { dispatch, isFetching } = useContext(Context);

  const handleLogin = async(e) =>{
    e.preventDefault();
    dispatch({type: "LOGIN_START"});
    try {
      const res = await axios.post("/auth/login", {
        username: username,
        password: password
      });
      dispatch({type: "LOGIN_SUCCESS", payload: res.data});
      res.data && window.location.replace("/");
    } catch (error) {
      dispatch({type: "LOGIN_FAILURE"});
    }
  };

    return (
<div className="container py-5">
    <div className="row">
        <div className="col col-md-6 col-lg-5 mx-auto">
<form onSubmit={handleLogin}>
  <div className="mb-3">
    <label htmlFor="username" className="form-label">Username</label>
    <input type="text" 
        className="form-control" 
        id="username"
        placeholder="Enter Your Username..."
        onChange={(e)=>setUsername(e.target.value)}
    />
  </div>

  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password"
        className="form-control"
        id="password"
        placeholder="Enter Your Password..."
        onChange={(e)=>setPassword(e.target.value)}
    />
  </div>

{
  isFetching ? 
  (
    <div className="text-center pt-2">
      <div className="spinner-border text-info" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : (
    <>
    <button type="submit" className="btn btn-primary w-100 login-btn">Login</button>
    <Link className="btn btn-warning w-100 my-3 text-white" to="/register">Register</Link>
    </>
  )
}
</form>
        </div>
    </div>
</div>
    );
};

export default Login;