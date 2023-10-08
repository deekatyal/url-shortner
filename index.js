const express = require("express");
const {connectToMongoDB} = require("./connect");
const urlRoute = require("./routes/url");
const path = require("path");
const cookieParser = require("cookie-parser");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");

// ROUTES
const staticRoute = require("./routes/staticRouter");
const URL = require("./models/url");
const userRoute = require("./routes/user");

const PORT = 8001;
const app = express();

connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(() => console.log("MongoDB connected"));


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))


// MW to parse form data
app.use(express.urlencoded({ extended : false }));
// MW to parse json data
app.use(express.json());
// MW to parse cookie data
app.use(cookieParser());

// restrictToLoggedinUserOnly is an inline MW which is restricted to "/url..." routes only
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/:shortId", async(req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
    {
        shortId,
    },
    { 
        $push: {
            visitHistory : { 
                timestamp : Date.now(),
            },
        },
    }
    );

    return res.redirect(entry.redirectUrl);
});

app.get("/url/test", async(req, res) => {
    const allUrls = await URL.find({});
    return res.render("home", {
        urls : allUrls,
    });
});

app.listen(PORT,() => console.log(`Server Started at PORT ${PORT}`));