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