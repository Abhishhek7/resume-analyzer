// require("dotenv").config()

// const app = require("../src/app")
// const connectToDB = require("../src/config/database")

// let dbPromise

// module.exports = async (req, res) => {
//     try {
//         if (!dbPromise) {
//             dbPromise = connectToDB()
//         }

//         await dbPromise

//         return app(req, res)
//     } catch (error) {
//         console.error("Vercel server error:", error)
//         return res.status(500).json({
//             message: "Internal server error"
//         })
//     }
// }

require("dotenv").config();

const app = require("../src/app");
const connectToDB = require("../src/config/database");

let dbPromise;

module.exports = async (req, res) => {
    try {
        if (!dbPromise) {
            dbPromise = connectToDB();
        }

        await dbPromise;

        return app(req, res);

    } catch (error) {
        console.error("Vercel server error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};