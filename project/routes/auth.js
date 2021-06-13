var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");
const users_utils = require("../routes/utils/users_utils")

router.post("/register", async (req, res, next) => {
  try {
    const users = await DButils.execQuery(
      "SELECT * FROM users"
    );

    if (users.find((x) => x.username === req.body.username))
      throw { status: 409, message: "Username is already taken" };

    //hash the password
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    req.body.password = hash_password;

    // add new user
    await DButils.execQuery(
      `INSERT INTO dbo.users (username, firstname, lastname, country, password, email, profile_picture) VALUES
       ('${req.body.username}', '${req.body.firstname}', '${req.body.lastname}', '${req.body.country}',
        '${hash_password}', '${req.body.email}', '${req.body.profile_picture}')`
    );
    res.status(201).send("User has been created");
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = (
      await DButils.execQuery(
        `SELECT * FROM users WHERE username = '${req.body.username}'`
      )
    )[0];

    // check if username exists & the password is correct
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.user_id;
        
    const roles_list = await users_utils.getUserRoles(user.user_id);
    // return roles
    res.status(200).send({ roles: roles_list });
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  if (!req.session || !req.session.user_id){
    throw { status: 412, message: "no user is logged in" };
  }
  req.session.reset(); 
  res.status(200).send("logout succeeded");
});

module.exports = router;
