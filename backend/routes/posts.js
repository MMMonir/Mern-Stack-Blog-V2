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