var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const match_utils = require("./utils/match_utils");


router.get("/summary", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.status(200).send(league_details);
  } catch (error) {
    next(error);
  }
});

router.get("/current_fixture", async (req, res, next) => {
  try{
    const current_fixture = await match_utils.getCurrentFixture(await league_utils.getLeagueId());
    if(current_fixture.length==0){
      throw ({status:400, message:"didnt find available data on league" });
    }
    results = await match_utils.prePostMatches(current_fixture);
    res.status(200).send(results);
  }
  catch(error){
    next(error)
  }
});

module.exports = router;
