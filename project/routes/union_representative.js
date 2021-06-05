var express = require("express");
var router = express.Router();
const users_utils = require("./utils/users_utils");
const match_utils = require("./utils/match_utils");
const team_utils = require("./utils/team_utils");
const league_utils = require("./utils/league_utils");

// middleware - verify that the user is union representative
router.use(async function(req,res,next){
    try{
      const user_id = req.session.user_id;
      const is_union_rep = await users_utils.isRole(user_id,'union_rep');
      if(!is_union_rep){
        throw ({ status: 403, message: "User isn't permitted"});
      }
      next();
    }
    catch (error) {
      next(error);
    }
  });
  
router.put("/assign_referee", async (req, res, next) => {
    try{
        const ref_user_id = await users_utils.getUserIdByUsername(req.body.username);
        if(ref_user_id == "not found"){
            throw ({ status: 404, message: "Username was not found"});
        }
        //check if the user to assign referree is already referee
        const is_referee = await users_utils.isRole(ref_user_id,'referee');
        if(is_referee){
            throw ({ status: 412, message: "user is already referee"});
        }
        else{
            await users_utils.assignRole(ref_user_id,"referee")
            res.status(200).send("The role was assigned successfuly");
        }
    }
    catch (error) {
        next(error);
    }
});

router.put("/assign_referee_league", async (req, res, next)=>{
    try{
        const ref_user_id = await users_utils.getUserIdByUsername(req.body.username);
        if(ref_user_id == "not found"){
            throw ({ status: 404, message: "The referee's username was not found"});
        }
        //check if the user to assign referree is already referee
        const is_referee = await users_utils.isRole(ref_user_id,'referee');
        if(!is_referee){
            throw ({ status: 412, message: "To assign referee to a league, The user should be already a referee"});
        }
        else{
            await league_utils.assignRefereeToLeague(ref_user_id, await league_utils.getLeagueId());
            res.status(200).send("The referee was assigned to the league successfuly");
        }
    } 
    catch (error) {
        next(error);
    }
});

router.put("/add_score", async(req, res, next)=>{
    try{
        await match_utils.updateScore(req.body.match_id, req.body.score);
        res.status(200).send("The score was assigned successfuly")
    }
    catch(error) {
        next(error);
    }
});

router.put("/add_event", async(req, res, next)=>{
    try{
        await match_utils.addEvent(req.body.match_id, req.body.event);
        res.status(200).send("The event was added successfuly")
    }
    catch(error) {
        next(error);
    }
});

router.post("/match", async (req, res, next) => {
    try{
        // make sure both teams are in superleague
        let ht = await team_utils.getTeamsByName(req.body.home_team_name);
        let at = await team_utils.getTeamsByName(req.body.away_team_name);
        if (ht.length == 0 || at.length == 0){
            throw({status: 404, message: "one of the teams not found"});
        }
        let home_team = ht[0];
        let away_team = at[0];
        let home_team_leagues = await league_utils.getleaguesOfTeam(home_team.id);
        let away_team_leagues = await league_utils.getleaguesOfTeam(away_team.id);
        let league_id = await league_utils.getLeagueId();
        if (!home_team_leagues.includes(league_id) || !away_team_leagues.includes(league_id)){
            throw({status: 404, message:"one of the teams not found"});
        }
        // make sure no games are set in this day
        let number_of_home_team_matches = await team_utils.teamMatchesOnDay(req.body.home_team_name, req.body.date);
        let number_of_away_team_matches = await team_utils.teamMatchesOnDay(req.body.away_team_name, req.body.date);
        if (number_of_home_team_matches.length > 0 || number_of_away_team_matches.length > 0){
            throw({status:400, message: "invalid match day"});
        }
        // make sure ref is in league
        let ref_id = await users_utils.getUserIdByUsername(req.body.referee_name);
        if (ref_id == "not found"){
            throw({status: 404, message: "referee not found"});    
        }
        let ref_league = (await users_utils.getRefLeague(ref_id));
        if (ref_league == 0 || ref_league[0].league_id != league_id){
            throw({status: 404, message: "referee is not in this league"});
        }
        
        // check court of home team
        let match_court = home_team.venue_id
        // add match (home team, away team, ref, court, date, stage)
        await match_utils.addMatch({
            home_team: req.body.home_team_name,
            away_team: req.body.away_team_name,
            league_id: league_id,
            season: await league_utils.getSeasonName(),
            stage: await league_utils.getCurrentStage(),
            court: match_court,
            referee_name: req.body.referee_name,
            date: req.body.date,
            score: NaN
         })
         res.status(201).send("match has been created");
    }
    catch (error) {
        next(error);
    }
});


router.get("/matches/:league_id", async (req, res, next) => {
    try{
      const matches = await league_utils.getLeagueMatches(req.params.league_id);
      if(matches.length==0){
        throw({ status: 400, message: "didnt find available data on league" });
      }
      let results = await match_utils.extractRelevantData(matches);
      res.status(200).send(results);
    
    }
    catch(error){
      next(error)
    }
  });

module.exports = router;
