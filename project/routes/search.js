var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/team_utils");
const search_utils = require("./utils/search_utils");
     

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
        console.log(results)
        if (req.query.sorted){
            search_utils.sortArray(results, function(a,b){
                return a.fullname - b.fullname;
            })
        }
        res.status(200).send(results);
    } catch (error) {
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

module.exports = router;

  