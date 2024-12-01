
var route = require('express').Router();

authorizationToken = (req, res, next) => {
  next();
};

// @FEED
route.get(['/', '/~', '/feed'], authorizationToken, async (req, res) => {
  let error = req.query['e']

  // const posts = await Posts.find().limit(20).sort({ _id: -1 });
  // const users = await User.find().limit(5).sort({ _id: -1 }).select("-password -email")
 
  return res.render('feed', {
    error: error,
    settings:{
        icon:"http://localhost:3000/image/favicon.png",
        title:"Infinity",
        css:"main"
    }
  })
});
// @CREATE
route.get(['/create'], authorizationToken, async (req, res) => {
  let error = req.query['e']
  return res.render('create', {
    error: error,
    settings:{
        icon:"http://localhost:3000/image/favicon.png",
        title:"Infinity / Create",
        css:"create"
    }
  })
});

module.exports = route;