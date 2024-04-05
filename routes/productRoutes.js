const express = require("express");
const router = express.Router();
const Product = require("../model/productModel");
const middleware = require("../middleware/auth");

router.post("/add", middleware, async (req, res) => {
    try {
        const addProduct = await Product.create({ ...req.body, owner: req.userId });
        // await addProduct.populate("creator").execPopulate();
        res.send(addProduct);
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
        const products = await Product.find().skip((page - 1) * 17).limit(10); 
        return res.status(200).json({ data: products, currentPage: page });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error"); 
    }
})

router.patch("/update/:productId", middleware, async (req, res) => { 

    console.log(req.params.productId)
    try {
        const product = await Product.findById(req.params.productId);
        if (product.owner.toString() !== req.userId) { 
            return res.status(403).send("Unauthorized"); 
        }
        const updateProduct = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
        res.send(updateProduct);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error"); 
    }
});

router.delete("/delete/:productId", middleware, async (req, res) => { 
    const productId = req.params.productId; 
    try {
        const product = await Product.findById(productId);
        if (product.creator.toString() !== req.userId) { 
            return res.status(403).send("Unauthorized"); 
        }
        const deleteProduct = await Product.findByIdAndDelete(productId);
        if (!deleteProduct) {
            return res.status(404).json({ error: 'Product not found' }); 
        }
        res.status(200).json({ msg: 'Product has been deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to delete the product' });
    }
});

module.exports = router;
