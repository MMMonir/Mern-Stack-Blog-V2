import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SideBar from '../../components/sideBar/SideBar';
import { Context } from '../../context/Context';

const SinglePost = () => {
  const PF = "http://localhost:5000/images/";
  const { user } = useContext(Context);
  const [ post, setPost] = useState({});
  const location = useLocation();
  const path = (location.pathname.split("/")[2]);

  const [ title, setTitle ] = useState("");
  const [ desc, setDesc ] = useState("");
  const [ updateMode, setUpdateMode ] = useState(false);
  const [ updating, setUpdating ] = useState(false);
  
useEffect(()=> {
  const getPost = async () =>{
    const res = await axios.get("/posts/"+path);
    setPost(res.data);
    setTitle(res.data.title);
    setDesc(res.data.desc)
  }
  getPost();
}, [path]);

const handleDelete = async () =>{
  try {
    const res = await axios.delete(`/posts/${post._id}`, {
      username: user.username
    });
    res.data && window.location.replace("/");
  } catch (error) {}
};

const handleUpdate = async() =>{
  try {
    const res = await axios.put(`/posts/${post._id}`, {
      username: user.username,
      title,
      desc
    });
    res.data && window.location.reload();
    setUpdating(true);
  } catch (error) {
    
  }
}

    return (
<div className="container py-5">
    <div className="row g-4">
        <div className="col-12 col-md-12 col-lg-8">
<div>
     <div className="card h-100 shadow card-effect">
       <div className="card-body">
         <div className="text-center py-0">

         {
            post.photo && <img src={PF + post.photo} alt="" className="w-100"/>
          }

{
  updateMode ? "" : 
  <>
    {
      post.username === user?.username &&
      <div className="py-2">
        <i className='bx bxs-edit me-2' 
          style={{"fontSize":"25px", "cursor":"pointer"}}
          onClick={()=>setUpdateMode(true)}
        ></i>
        <i className='bx bx-trash-alt text-warning' 
          style={{"fontSize":"25px", "cursor":"pointer"}}
          onClick={handleDelete}
        ></i>
      </div>
    }
</>
}
            
<div className="">
  <Link className="badge rounded-pill bg-light text-dark text-capitalize text-decoration-none" to={`/?cat=${post.categories}`}>{post.categories}</Link>
  {
    updateMode
    ? 
    <div className="py-2">
      <input type="text" placeholder={post.title} 
      className="w-100 text-center border-0 border-bottom"
      value={title}
      onChange={(e)=>setTitle(e.target.value)}
      /> 
    </div>
    : 
    <h5 className='pt-3 pb-0'>{post.title}</h5>
  }
  <div className="d-flex justify-content-between">
    <span className="pt-0 mt-0 text-capitalize" style={{"color":"#6c757d", "fontSize":".9rem"}}>Author: <Link to={`/?user=${post.username}`}>{post.username}</Link>
    </span>
    <span style={{"color":"#6c757d", "fontSize":".9rem"}}><i>
    {new Date(post.createdAt).toDateString()}
    </i></span>
  </div>
  {
    updateMode
    ? 
    <>
      <div className="py-2">
        <textarea type="text" placeholder={post.desc} 
        className="w-100 text-center border-0 border-bottom"
        value={desc}
        onChange={(e)=>setDesc(e.target.value)}
        /> 
      </div>
      {
        updating ?
        <div className="text-center pt-2">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        :
        <button className="btn btn-warning text-white" onClick={handleUpdate}>Update</button>
      }
    </>
    : 
    <p className="text-start pt-2">{post.desc}</p>
  }
  
</div>
         </div>
       </div>
     </div>
</div>
{/* Single Post */}
        </div>
        <div className="col-12 col-md-12 col-lg-4">
            <SideBar/>
        </div>
    </div>
</div>
    );
};

export default SinglePost;