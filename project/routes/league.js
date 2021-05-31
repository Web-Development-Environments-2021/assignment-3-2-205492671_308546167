var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const match_utils = require("./utils/match_utils");


router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});

router.get("/matches/:league_id", async (req, res, next) => {
  try{
    const matches = await league_utils.getLeagueMatches(req.params.league_id);
    if(matches.length==0){
      res.status(400).send("didnt find avilable data on league");
      return;
    }
    let results = match_utils.extractRelevantData(matches);
    res.status(200).send(results);
  
  }
  catch(error){
    next(error)

  }
  
});

router.get("/current_fixture", async (req, res, next) => {
  try{
    const current_fixture = await match_utils.getCurrentFixture(await league_utils.getLeagueId());
    if(current_fixture.length==0){
      res.status(400).send("didnt find avilable data on league");
      return;
    }
    results = match_utils.prePostMatches(current_fixture);
    res.status(200).send(results);
  
  }
  catch(error){
    next(error)

  }
  
});





module.exports = router;
