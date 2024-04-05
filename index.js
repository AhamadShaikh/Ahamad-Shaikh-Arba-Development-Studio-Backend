

const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const userRouter = require("./routes/userRoutes")
const productRouter = require("./routes/productRoutes")
const categoryRouter = require("./routes/categoryRoutes")
require("dotenv").config()
const cors = require("cors")

app.use(express.json());
app.use(express.text());
app.use(cors());


const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
    } catch (error) {
        console.log(error)
    }
}

app.use("/user", userRouter)
app.use("/product", productRouter)
// app.use("/category", categoryRouter)

app.use(cors({
    origin: '*'
}));


app.listen(7000, (err) => {
    connection();
    console.log("server is listening on port 7000")
})