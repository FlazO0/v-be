
var route = require('express').Router();

authorizationToken = (req, res, next) => {
  next();
};

// @POST
route.get("/#:_", authorizationToken, async (req, res) => {
  try {
    const { word } = req.body;
    if (!word) return res.status(400).json({
      message: "Empty argument",
      fault: true,
    });

    const user = await User.find({
      $or: [
        { username: word },
        { name: word },
        { email: word },
      ],
    }).select("-password -logged -active -date_birth");
    if (user.length === 0) return res.status(404).json({ 
      message: "User not found",
      fault: true,
    });

    return res.status(200).json({
      message: "Success",
      fault: false,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
      fault: true,
    });
  }
});
// @USER
route.get("/@:_", authorizationToken, async (req, res) => {
  try {
    const { _id } = req.params;
    if (!_id) return res.status(400).json({
      message: "Empty argument",
      fault: true,
    });

    const user = await User.findById({ _id: _id }).select("-password -logged -active -date_birth");
    if (!user) return res.status(400).json({
      message: "User not found",
      fault: true,
    });

    return res.status(200).json({
      message: "Success",
      fault: false,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
      fault: true,
    });
  }
});
// @REGISTER
route.post("/register", authorizationToken, async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) return res.status(400).json({
      message: "Empty argument",
      fault: true,
    });

    const search = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (search) return res.status(400).json({
      message: "This user already exists",
      fault: true,
    });

    const create = new User({
      name: name,
      username: username,
      email: email,
      active: true,
      photo: null,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.ITERATIONS))),
      enemies: [],
      followers: [],
      following: [],
    });

    await create.save();

    return res.status(200).json({
      message: "Success",
      fault: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
      fault: true,
    });
  }
});
// @LOGIN
route.post("/login", authorizationToken, async (req, res) => {
  try {
    const { user, password } = req.body;
    if (!user || !password) return res.status(400).json({
      message: "Empty argument",
      fault: true,
    });

    const login = await User.findOne({
      $or: [{ username: user }, { email: user }],
    });
    if (!login) return res.status(400).json({
      message: "User not found",
      fault: true,
    });

    const comparPassword = bcrypt.compareSync(password, login.password);
    if (!comparPassword) return res.status(400).json({
      message: "Invalid password",
      fault: true,
    });

    if (login.active == false) {
      await User.findByIdAndUpdate(
        { _id: login._id },
        {
          active: true,
        }
      );
    }

    login.email = undefined;
    login.date_birth = undefined;
    login.active = undefined;
    login.enemies = undefined;
    login.following = undefined;
    login.followers = undefined;
    login.password = undefined;
    const logged = await User.findByIdAndUpdate(
      { _id: login._id },
      { logged: true }
    );
    if (logged) login.logged = true;

    const token = jwt.sign({ _id: logged._id }, process.env.SECRET, {
      expiresIn: 8000,
    });

    const data = login;
    return res.status(200).json({
      message: "Success",
      fault: false,
      data,
      accessToken: token
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
      fault: true,
    });
  }
});
// @ME
route.get("/@me", authorizationToken, async (req, res) => {
  try {
    const me = await User.findById({ _id: req._id }).select("-password");
    return res.status(200).json({
      message: "Success",
      fault: false,
      data: me,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
      fault: true,
    });
  }
});

module.exports = route;