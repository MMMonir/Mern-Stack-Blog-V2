import React from 'react';
import { Link } from 'react-router-dom';

const Post = ({post}) => {
  const PF = "http://localhost:5000/images/";
    return (
<div className="col">
     <div className="card h-100 shadow card-effect">
       <div className="card-body">
         <div className="text-center py-0">
         {
            post.photo && <img src={PF + post.photo} alt="" className="w-100"/>
          }
         <div className="pt-3">
         <Link className="badge rounded-pill bg-light text-dark text-capitalize text-decoration-none" to={`?cat=${post.categories}`}>{post.categories}</Link>
           <Link to={`/post/${post._id}`}><h5 className='pt-3 pb-0'>{post.title}</h5></Link>
           <p className="pb-0 mb-0" style={{"color":"#6c757d", "fontSize":".9rem"}}><i>{new Date(post.createdAt).toDateString()}</i></p>
           <p className="pt-0 mt-0 text-capitalize" style={{"color":"#6c757d", "fontSize":".9rem"}}>Author: {post.username}</p>
           <p>{post.desc}</p>
         </div>
         </div>
       </div>
     </div>
</div>
    );
};

export default Post;