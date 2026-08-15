// const express = require("express")
// const cookieParser = require("cookie-parser")
// const cors = require("cors")

// const app = express()

// app.use(express.json())
// app.use(cookieParser())

// app.use(cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true
// }))

// const authRouter = require("./routes/auth.routes")
// const interviewRouter = require("./routes/interview.routes")

// app.use("/api/auth", authRouter)
// app.use("/api/interview", interviewRouter)

// app.use((req, res, next) => {
//     console.log(req.method, req.originalUrl)
//     next()
// })

// module.exports = app
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: "https://resume-analyzer-one-nu.vercel.app",
    credentials: true
}))

const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Resume Analyzer API is running"
    })
})

module.exports = app