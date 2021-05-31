var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const team_utils = require("./utils/team_utils");
const match_utils = require("./utils/match_utils");

router.get("/page/:team_id", async (req, res, next) => {
  try {
    let players_detail = await players_utils.getPlayersByTeam(
      req.params.team_id
    );
    if(players_detail.length == 0)
      res.status(404).send("team_id not found");
    let team_name = players_detail[0].team_name;
    let season = '2020/2021'; //todo change
    let team_matches = team_utils.teamSeasonMatches(team_name,season);
    let prePostlists = match_utils.prePostMatches(team_matches);
    let results = { team_id: req.params.team_id,
                    team_players: players_detail,
                    pre_play_matches: prePostlists.pre_played_match,
                    post_play_matches: prePostlists.post_played_match}
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
