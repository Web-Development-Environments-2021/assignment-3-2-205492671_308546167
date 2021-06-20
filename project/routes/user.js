var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const match_utils = require("./utils/match_utils");
const union_rep = require("./union_representative");



// Authenticate all incoming requests by middleware
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } 
  else {
    res.sendStatus(401);
  }
});

// Handle union representative requests
router.use("/union_representative", union_rep);



// This path gets body with match id and save this match in the favorites list of the logged-in user
 
router.put("/favorites/matches", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const match_id = req.body.match_id;
    await users_utils.markMatchAsFavorite(user_id, match_id);
    res.status(200).send("The match successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});


// This path returns the favorites matches that were saved by the logged-in user
router.get("/favorites/matches", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const matches = await users_utils.getFavoriteMatches(user_id);
    const fav_matches_relevent = await match_utils.prePostMatches(matches);
    res.status(200).send(fav_matches_relevent.pre_played_matches);
  } catch (error) {
    next(error);
  }
});


router.put("/Logout", function (req, res) {
  if (!req.session || !req.session.user_id){
    throw { status: 412, message: "no user is logged in" };
  }
  req.session.reset(); 
  res.status(200).send("logout succeeded");
});

module.exports = router;
