
var route = require('express').Router();

route.use(function (req, res) {
    res.status(404).render("404", {
        settings: {
            icon: "",
            title: "Not Found",
            css: "404"
        }
    })
});

module.exports = route;