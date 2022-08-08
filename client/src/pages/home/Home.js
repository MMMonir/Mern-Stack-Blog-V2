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