
console.clear(), require("dotenv").config();
var fileUpload      = require('express-fileupload');
var compression     = require('compression');
var express         = require("express");
var chalk           = require("chalk");
var cors            = require("cors");

const sessionConfig = require("./config/session");
const connectDB = require('./config/db');

const x = express();

connectDB();
sessionConfig(x);


x.set('views', './cli/views');
x.set('view engine', 'ejs');

x.use(cors());
x.use(fileUpload());
x.use(compression());
x.use(express.json());
x.use(express.static('./cli/public'));
x.use(express.urlencoded({ extended: true }));
x.use("/uploads", express.static("./uploads"));
x.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
});

//x.use(require("./routers/user"));
//x.use(require("./routers/feed"));
//x.use(require("./routers/errors"));

x.listen(process.env.SERVER_PORT, () => {
    console.log(chalk.bold.white("\n    >>>") + chalk.italic.blue(` I'm listening to the server at http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/  `));
});