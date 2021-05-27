var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/team_utils");


router.get("/player/search", async (req, res, next) => {
    try {
      const results = await players_utils.getPlayersByName(req.query.player_name);
      res.status(200).send(results);
    } catch (error) {
      next(error);
    }
  });

router.get("/team/search", async (req, res, next) => {
    try {
        const results = await teams_utils.getTeamsByName(req.query.team_name);
        res.status(200).send(results);
    } catch (error) {
        next(error);
    }
});

module.exports = router;

  