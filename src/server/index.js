const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const AYLIENTextAPI = require("aylien_textapi");
const config = require("../../webpack.dev");
const cors = require('cors');
const compiler = webpack(config);

const PORT = process.env.PORT || 8081;
const isDevEnvironment = process.env.NODE_ENV == "development";

const textapi = new AYLIENTextAPI({
    application_id: "1fae14f0",
    application_key: "d9b5d725c1546bcd70c086a4238af063"
});

const app = express();

app.use(express.json());

app.use(cors())
if (isDevEnvironment) {
    app.use(
      webpackDevMiddleware(compiler, {
          publicPath: config.output.publicPath
      })
    );
    app.use(require("webpack-hot-middleware")(compiler));
}

if (!isDevEnvironment) app.use(express.static("dist"));

app.get("/", (req, res) => {
    res.sendFile("dist/index.html");
});

app.post("/sentiment", (req, res) => {
    const { url } = req.body;

    textapi.sentiment({ url }, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        res.json(data);
    });
});

// designates what port the app will listen to for incoming requests
app.listen(PORT, () => {
    console.log("Example app listening on port 8081!");
});
