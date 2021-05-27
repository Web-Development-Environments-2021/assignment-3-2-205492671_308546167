var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");

/**
 * Authenticate all incoming requests by middleware
 */
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
  } else {
    res.sendStatus(401);
  }
});

/**
 * This path gets body with playerId and save this player in the favorites list of the logged-in user
 */
router.post("/favorites/players", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const player_id = req.body.playerId;
    await users_utils.markPlayerAsFavorite(user_id, player_id);
    res.status(201).send("The player successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites players that were saved by the logged-in user
 */
router.get("/favorites/players", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let favorite_players = {};
    const player_ids = await users_utils.getFavoritePlayers(user_id);
    let player_ids_array = [];
    player_ids.map((element) => player_ids_array.push(element.player_id)); //extracting the players ids into array
    const results = await players_utils.getPlayersInfo(player_ids_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

router.use("/union_representative", async function(req,res,next){
  try{
    const user_id = req.session.user_id;
    let user_roles = []
    user_roles = await users_utils.getUserRoles(user_id);
    const is_union_rep = user_roles.find(element => element =='union_rep');
    if(!is_union_rep){
      res.status(401).send("Only union representatives allow to assign referee");
    }
    next();
  }
  catch (error) {
    next(error);
  }
  
});

router.put("/union_representative/assign_referee", async (req, res, next) => {
  try{
    const ref_user_id = await users_utils.getUserIdByUsername(req.body.username);
    if(ref_user_id == "not found"){
      res.status(404).send("Username was not found");
    }
    await users_utils.assignRole(ref_user_id,"referee")
    res.status(200).send("The role was assigned successfuly");
  } catch (error) {
    // next(error);
  }

});

module.exports = router;
