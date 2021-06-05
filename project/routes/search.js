var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/team_utils");
const search_utils = require("./utils/search_utils");
const league_utils = require("./utils/league_utils");
     

router.get("/player/search", async (req, res, next) => {
    try {
      const results = await players_utils.getPlayersByName(req.query.player_name);
      if (req.query.filtered_by && req.query.filtered_by == "position"){
        results = search_utils.filterArray(results, "position_num", req.query.filter);
      }
      if (req.query.filtered_by && req.query.filtered_by == "team name"){
        results = search_utils.filterArray(results, "team_name", req.query.filter);
      }
      if (req.query.sorted && req.query.sorted == "team name"){
        search_utils.sortArray(results, "team_name");
      }
      if (req.query.sorted && req.query.sorted == "player name"){
        search_utils.sortArray(results, "fullname");
      }
      res.status(200).send(results);
    } catch (error) {
      next(error);
    }
  });

router.get("/team/search", async (req, res, next) => {
    try {
        const results = teams_utils.extractRelevantTeamData(await teams_utils.getTeamsByName(req.query.team_name));

        if (!(await league_utils.getLeagueTeams(league_utils.getLeagueId())).includes(results[0].team_id)){
          throw({status: 404, message: "team_id not found"});
        }
        if (req.query.sorted){
            search_utils.sortArray(results, function(a,b){
                return a.fullname - b.fullname;
            })
        }
        res.status(200).send(results);
    } 
    catch (error) {
        next(error);
    }
});


router.get("/player/page/:player_id", async (req, res, next) => {
    try {
        const results = await players_utils.getPlayerFullInfo(req.params.player_id);        
        res.status(200).send(results);
    } catch (error) {
        next(error);
    }
});

router.get("/search/player", async (req, res, next) => {
  try {
    const players = await players_utils.getPlayersBySeasonId(await league_utils.getSeasonID());
    const results = await players_utils.extractRelevantPlayerData(players);
    
    res.status(200).send(results);
  } 
  catch (error) {
    next(error);
  }
});

router.get("/search/team", async (req, res, next) => {
  try {
    const teams = await teams_utils.getTeamsBySeasonId(await league_utils.getSeasonID());
    const results = await teams_utils.extractRelevantTeamData(teams);

    res.status(200).send(results);
  } 
  catch (error) {
    next(error);
  }
});

module.exports = router;

  