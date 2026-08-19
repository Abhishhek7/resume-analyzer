const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "https://resume-analyzer-1kaz.vercel.app",
];

app.use(cors({
    origin: function (origin, callback) {
        console.log("REQUEST ORIGIN:", origin);

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("BLOCKED ORIGIN:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Resume Analyzer API is running"
    });
});

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// These two must stay last, in this order: unmatched routes -> 404, everything else -> central handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;