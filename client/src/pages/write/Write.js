import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Context } from '../../context/Context';

const Write = () => {
    const [ title, setTitle ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ file, setFile ] = useState(null);
    const { user } = useContext(Context);

    const handleWrite = async(e)=>{
        e.preventDefault();
        const newPost ={
            title:title,
            desc: description,
            username: user.username
        }
        if (file) {
            const data =new FormData();
            const filename = Date.now() + file.name;
            data.append("name", filename);
            data.append("file", file);
            newPost.photo = filename;
            try {
              await axios.post("/upload", data);
            } catch (err) {}
        }

        try {
            const res = await axios.post("/posts", newPost)
            res.data && window.location.replace("/post/"+ res.data._id)
        } catch (error) {
            
        }
    }

    return (
<div className="container py-5">
    <div className="row">
        <div className="col col-md-6 mx-auto">
        {
        file && <img src={URL.createObjectURL(file)} alt="" className="w-100" style={{"height": "250px", "borderRadius": "10px", "objectFit": "cover"}}/>
    }
<form onSubmit={handleWrite}>
    <div className="my-3">
        <label htmlFor="formFile" className="form-label">Upload Image</label>
        <input className="form-control" type="file" id="formFile"
        onChange={(e)=>setFile(e.target.files[0])}
        />
    </div>

  <div className="mb-3">
    <label htmlFor="title" className="form-label">Title</label>
    <input type="text" 
        className="form-control" 
        id="title"
        placeholder="Enter your Title..."
        onChange={(e)=>setTitle(e.target.value)}
    />
  </div>

  <div className="mb-3">
    <label htmlFor="description" className="form-label">Description</label>
    <textarea name="" id="description" rows="5" className="w-100"
        placeholder="Enter Your Description....."
        onChange={(e)=>setDescription(e.target.value)}
    ></textarea>
  </div>

  <button type="submit" className="btn btn-primary">Publish</button>
</form>
        </div>
    </div>
</div>
    );
};

export default Write;