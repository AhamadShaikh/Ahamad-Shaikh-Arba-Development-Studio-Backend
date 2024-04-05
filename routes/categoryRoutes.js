const express = require("express");
const router = express.Router();
const Category = require("../model/categoryModel");
const middleware = require("../middleware/auth");

router.post("/add", middleware, async (req, res) => {
  try {
    const addCategory = await Category.create({ ...req.body, owner: req.userId });
    res.send(addCategory);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/", middleware, async (req, res) => {
  try {
    let { page } = req.query;
    if (!page)
      page = 1;
    const categories = await Category.find().skip((page - 1) * 17).limit(10);
    return res.status(200).json({ data: categories, currentPage: page });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
})

router.patch("/update/:categoryId", middleware, async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (category.owner.toString() !== req.userId) {
      return res.status(403).send("Unauthorized");
    }
    const updateCategory = await Category.findByIdAndUpdate(req.params.categoryId, req.body, { new: true });
    res.send(updateCategory);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/delete/:categoryId", middleware, async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await Category.findById(categoryId);
    if (category.owner.toString() !== req.userId) {
      return res.status(403).send("Unauthorized");
    }
    const deleteCategory = await Category.findByIdAndDelete(categoryId);
    if (!deleteCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ msg: 'Category has been deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to delete the category' });
  }
});

module.exports = router;
