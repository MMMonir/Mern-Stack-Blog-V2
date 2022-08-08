import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ error, setError ] = useState(false);

  const handleRegister = async(e) =>{
    e.preventDefault();
    setError(false);
    try {
      const res = await axios.post("/auth/register",{
        username:username,
        email: email,
        password: password
      })
      res.data && window.location.replace("/login");
    } catch (error) {
      setError(true);
    }
  }
    return (
<div className="container py-5">
    <div className="row">
        <div className="col col-md-6 col-lg-5 mx-auto">
<form onSubmit={handleRegister}>
  <div className="mb-3">
    <label htmlFor="username" className="form-label">Username</label>
    <input type="text" 
        className="form-control" 
        id="username"
        placeholder="Enter your username..."
        onChange={(e)=>setUsername(e.target.value)}
    />
  </div>

  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email</label>
    <input type="email" 
        className="form-control" 
        id="email"
        placeholder="Enter your email..."
        onChange={(e)=>setEmail(e.target.value)}
    />
  </div>

  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password"
        className="form-control"
        id="password"
        placeholder="Enter your password..."
        onChange={(e)=>setPassword(e.target.value)}
    />
  </div>

  <button type="submit" className="btn btn-primary w-100">Register</button>
</form>
<Link className="btn btn-warning w-100 my-3 text-white" to="/login">Login</Link>
{
  error &&
  <div className="text-center text-danger">
  <p>Some things goes wrong...</p>
</div>
}
        </div>
    </div>
</div>
    );
};

export default Register;