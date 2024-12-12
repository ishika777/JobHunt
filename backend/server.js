require("dotenv").config({})
const express = require("express")
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser")
const connectDb = require("./utils/db")
const userRouter = require("./routes/user-route")
const companyRouter = require("./routes/company-route")
const jobRouter = require("./routes/job-route")
const applicationRouter = require("./routes/application-route")

const corsOptions = {
    origin : "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
    credentials : true,
}
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser())
app.use(cors(corsOptions))



app.get("/", (req, res) => {
    res.send("hello")
})

app.use("/api/v1/user", userRouter)
app.use("/api/v1/company", companyRouter)
app.use("/api/v1/job", jobRouter)
app.use("/api/v1/application", applicationRouter)


app.listen(process.env.PORT || 3000, () => {
    connectDb()
    console.log(`app is listening at server ${process.env.PORT}`);
})