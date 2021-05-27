var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    const users = await DButils.execQuery(
      "SELECT * FROM users"
    );

    if (users.find((x) => x.username === req.body.username))
      throw { status: 409, message: "Username taken" };

    //hash the password
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    req.body.password = hash_password;

    // add the new username
    await DButils.execQuery(
      `INSERT INTO dbo.users (username, firstname, lastname, country, password, email, profile_picture) VALUES
       ('${req.body.username}', '${req.body.firstname}', '${req.body.lastname}', '${req.body.country}',
        '${hash_password}', '${req.body.email}', '${req.body.profile_picture}')`
    );
    res.status(201).send("user created");
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

    console.log(user);

    // check that username exists & the password is correct
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }


    // Set cookie
    req.session.user_id = user.user_id;
   
    const roles = (
      await DButils.execQuery(
        `SELECT role_name FROM roles WHERE user_id = '${user.user_id}'`
      )
    );
    
    // check that user_id exists
    if (!roles) {
      throw { status: 401, message: "user_id doesn't exist" };
    }
    const names_list = [];
    roles.map((role)=> names_list.push(role.role_name));
        
    // return roles
    res.status(200).send(names_list);
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;
