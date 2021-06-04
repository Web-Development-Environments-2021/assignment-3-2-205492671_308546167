var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");
const team_utils = require("./utils/team_utils");
const match_utils = require("./utils/match_utils");
const league_utils = require("./utils/league_utils");


router.get("/page/:team_id", async (req, res, next) => {
  try {
    if (!(await league_utils.getLeagueTeams(league_utils.getLeagueId())).includes(req.params.team_id)){
      throw({status: 404, message: "team not found"});
    }
    let players_detail = await players_utils.getPlayersByTeam(req.params.team_id);
    // let players_detail = AGF_players;
    if(players_detail.length == 0)
      res.status(404).send("team_id not found");
    let team_name = players_detail[0].team_name;
    let season = '2020/2021'; //todo change
    let team_matches = await team_utils.teamSeasonMatches(team_name,season);
    let prePostlists = await match_utils.prePostMatches(team_matches);
    let results = { team_id: req.params.team_id,
                    team_players: players_detail,
                    pre_play_matches: prePostlists.pre_played_matches,
                    post_play_matches: prePostlists.post_played_match}
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
