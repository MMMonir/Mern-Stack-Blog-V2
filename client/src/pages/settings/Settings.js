import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Context } from '../../context/Context';

const Settings = () => {
  const PF = "http://localhost:5000/images/";
  const { user, dispatch } = useContext(Context);
  const [ username, setUsername ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ file, setFile ] = useState(null);

  const handleUpdate = async(e) =>{
    e.preventDefault();
    dispatch({type: "UPDATE_START"});
    const updatedUser = {
      userId: user._id,
      username,
      email,
      password
    }
    if (file) {
      const data =new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      updatedUser.profilePic = filename;
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }

    try {
      const res = await axios.put("/users/"+user._id, updatedUser);
      dispatch({type: "UPDATE_SUCCESS", payload:res.data});
    } catch (error) {
      dispatch({type: "UPDATE_FAILURE"});
    }

  }
    return (
<div className="container py-5">
    <div className="row">
        <div className="col col-lg-4">
<div className="d-flex align-items-center">
<img src={file ? URL.createObjectURL(file): PF+user.profilePic} alt="" 
style={{"width":"150px", "height":"150px", "borderRadius":"50%", "objectFit":"cover"}}
/>
<label htmlFor="formFile">
    <i className='bx bxs-camera rounded text-warning' style={{"fontSize":"30px", "marginLeft":"-60px", "marginTop":"75px", "cursor":"pointer"}}></i>
</label>

<input className="form-control" type="file" id="formFile" style={{"display":"none"}}
onChange={(e)=>setFile(e.target.files[0])}
/>
</div>
<form onSubmit={handleUpdate}>
  <div className="mb-3">
    <label htmlFor="username" className="form-label">Username</label>
    <input type="text" 
        className="form-control" 
        id="username"
        placeholder={user.username}
        onChange={(e)=>setUsername(e.target.value)}
    />
  </div>

  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email</label>
    <input type="email" 
        className="form-control" 
        id="email"
        placeholder={user.email}
        onChange={(e)=>setEmail(e.target.value)}
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

  <button type="submit" className="btn btn-primary">Update</button>
</form>
        </div>
    </div>
</div>
    );
};

export default Settings;