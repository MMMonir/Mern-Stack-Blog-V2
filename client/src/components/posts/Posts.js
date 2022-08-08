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