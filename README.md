### Mern Stack Blog Site V2

- ## Backend Packages:
```
npm init
npm add express mongoose dotenv multer
npm add nodemon
npm add bcrypt
npm add multer
npm add path
```

- # backend> Index.js
```
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");

dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen("5000", () => {
  console.log("Backend is running.");
});
```

- # backend> models> User.js
```
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
```

- # backend> models> Post.js
```
const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
```

- # backend> module> Category.js
```
const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
```

- # backend> routes> auth.js
```
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');


//REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({username: req.body.username});
    !user && res.status(400).json("Wrong Credentials");

    const passValidation = await bcrypt.compare(req.body.password, user.password);
    !passValidation && res.status(400).json("Wrong Credentials");

    const {password, ...other} = user._doc;

    res.status(200).json(user);

  } catch (error) {
    
  }

});


module.exports = router;
```

- # backend> routes> user.js
```
const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

//UPDATE
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your account!");
    }
  });
  
//Delete
router.delete("/:id", async(req, res)=>{
    if (req.body.userId === req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            try {
                await Post.deleteMany({ username: user.username });
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User has been deleted...");
            } catch (error) {
                
            }
        } catch (error) {
            res.status(200).json("Id Matched....")
        }
    } else {
        res.status(500).json("You can not delete this...")
    }
});

//Get User
router.get("/:id", async(req, res) =>{
    try {
        const user = await User.findById(req.params.id);
        const {password, ...other} = user._doc;
        res.status(200).json(other);
    } catch (error) {
        
    }
})


module.exports = router;
```


- # backend> routes> posts.js
```
const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

//CREATE POST
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//Get Post
router.get("/:id", async(req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Update Post
router.put("/:id", async(req, res) =>{
   try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
        try {
            const newPost = await Post.findByIdAndUpdate(
                req.params.id,
                {
                  $set: req.body,
                },
                { new: true }
              );
              res.status(200).json(newPost);
        } catch (error) {
            
        }
    } else {
    }
   } catch (error) {
    
   } 
})

//Delete Post
router.delete("/:id", async(req, res) =>{
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            await Post.findByIdAndDelete(req.params.id);
            res.status(200).json("You have successfully deleted your post...");
        } else {
            res.status(400).json("You can not able to deleted this post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET ALL POSTS
router.get("/", async (req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try {
      let posts;
      if (username) {
        posts = await Post.find({ username });
      } else if (catName) {
        posts = await Post.find({
          categories: {
            $in: [catName],
          },
        });
      } else {
        posts = await Post.find();
      }
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;
```


- # backend> routes> categories.js
```
const router = require("express").Router();
const Category = require("../models/Category");

//Create Category
router.post("/", async(req, res) =>{
    const newCategory = new Category(req.body);
    try {
        const category = await newCategory.save();
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/", async (req, res) => {
    try {
      const cats = await Category.find();
      res.status(200).json(cats);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//Get Category
router.get("/:id", async(req, res) =>{
    try {
        const category = await Category.findById(req.params.id);
        res.status(200).json(category);
    } catch (error) {
        
    }
})

module.exports = router;
```


- ## Client Parts

- # App.js
```
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/navBar/NavBar";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Settings from "./pages/settings/Settings";
import SinglePost from "./pages/singlePost/SinglePost";
import Write from "./pages/write/Write";


function App() {
  return (
    <div className="App">
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/write" element={<Write />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/post/:postId" element={<SinglePost />} />
      </Routes>
    </div>
  );
}

export default App;
```

- # client> pages> Home.js
```
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Posts from '../../components/posts/Posts';
import SideBar from '../../components/sideBar/SideBar';
import { useLocation } from 'react-router-dom';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const { search } = useLocation();
    
    useEffect(() => {
        const fetchPosts = async () => {
          const res = await axios.get("/posts"+search);
          setPosts(res.data);
        };
        fetchPosts();
      }, [search]);

    return (
<div className="container py-5">
    <div className="row g-4">
        <div className="col-12 col-md-12 col-lg-8">
            <Posts posts={posts}/>
        </div>
        <div className="col-12 col-md-12 col-lg-4">
            <SideBar/>
        </div>
    </div>
</div>
    );
};

export default Home;
```

- # client> pages> Login.js
```
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
```

- # client> pages> Register.js
```
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
```

- # client> pages> Setting.js 
```
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
```

- # client> pages> SinglePost.js
```
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
```

- # client> pages> Write.js
```
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
```

- # client> components> NavBar.js
```
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../context/Context';

const NavBar = () => {
  const PF = "http://localhost:5000/images/";
  const { user, dispatch } = useContext(Context);

  const handleLogout = () =>{
    dispatch({type: "LOGOUT"})
  } 
    return (
<nav className="navbar navbar-expand-lg navbar-light bg-light sticky-md-top shadow-sm">
  <div className="container">
    <Link className="navbar-brand" to="/">Udealr</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/">Home</Link>
        </li>
        {
          user &&
        <>
          <li className="nav-item">
            <Link className="nav-link" to="/write">Write</Link>
          </li>
          <li className="nav-item">
          <Link className="nav-link" to="/login" onClick={handleLogout}>Logout</Link>
        </li>
        </>
        }
      </ul>
      <div className="d-flex align-items-center my-1">
        {user ? (
          <Link to="/settings">
          <img 
           src={PF+user.profilePic} alt=""
            style={{"width": "40px", "height": "40px", "borderRadius":"50%", "objectFit":"cover"}}
             className="mx-2" 
          />
        </Link>
        ) : (
      <ul className="navbar-nav me-auto mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link" to="/login">Login</Link>
        </li>
        <li className="nav-item me-1">
          <Link className="nav-link" to="/register">Register</Link>
        </li>
      </ul>
        )}
      
      <i className='bx bx-search'
      style={{"fontSize":"20px"}}
      ></i>
      </div>
      {/* <form className="d-flex">
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form> */}
    </div>
  </div>
</nav>
    );
};

export default NavBar;
```


- # client> components> Posts.js
```
import React from 'react';
import Post from '../post/Post';

const Posts = ({posts}) => {
    return (
        <div className="row row-cols-1 row-cols-md-2 g-4">
            {
                posts.map((post)=>(
                    <Post post={post} key={post._id}/>
                ))
            }
        </div>
    );
};

export default Posts;
```


- # client> components> Post.js
```
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
```


- # client> components> SideBar.js
```
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cats from '../cats/Cats';

const SideBar = () => {
    const [ cats, setCats ] = useState([]);

    useEffect(() => {
        const getCats = async() =>{
            const res = await axios.get("/categories");
            setCats(res.data);
        }
        getCats();
    },[])

    return (
<div className='rounded bg-light py-3 px-2'>
<div className='p-2 text-center'>
    <p className='border-top border-bottom pb-1 mx-2 fs-5 mb-3'>ABOUT ME</p>
    <img 
      src="https://z-p3-scontent.fdac12-1.fna.fbcdn.net/v/t39.30808-6/285720020_3194677014081034_8148393953883939316_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeEu_r31fjIFLwy_Dil8G8HvAarvKUomLkwBqu8pSiYuTGWralpx1UnWUlkZEuAyecBVpMU1EqUq9IFePU4tM0mg&_nc_ohc=4VM0JrhstxUAX-2vrUq&_nc_ht=z-p3-scontent.fdac12-1.fna&oh=00_AT9S74YeUl1p0R_FNoDh-oUgDa6cH6OyKEy-kUTmEUJqaw&oe=62F223CD" alt=""
      style={{"width": "120px", "borderRadius":"50%"}}
      className="me-2 my-1" 
      />
      <p>Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.</p>
      <p className='border-top border-bottom pb-1 mx-2 fs-5 mt-4'>CATEGORY</p>
      <div className='text-start'>

    {
        cats.map((cat)=>(
            <Cats cat={cat} key={cat._id}/>
        ))
        
    }

      </div>
</div>
</div>
    );
};

export default SideBar;
```
- # client> components> Cats.js
```
import React from 'react';
import { Link } from 'react-router-dom';

const Cats = ({cat}) => {
    return (
            <Link className="btn btn-primary py-1 m-1 text-capitalize" to={`/?cat=${cat.name}`} role="button">{cat.name}</Link>
    );
};

export default Cats;
```