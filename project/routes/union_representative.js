var express = require("express");
var router = express.Router();
const users_utils = require("./utils/users_utils");
const match_utils = require("./utils/match_utils");
const team_utils = require("./utils/team_utils");
const league_utils = require("./utils/league_utils");

router.use(async function(req,res,next){
    try{
      const user_id = req.session.user_id;
      const is_union_rep = await users_utils.isRole(user_id,'union_rep');
      if(!is_union_rep){
        res.status(401).send("Only union representatives allow to assign referee");
        return;
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
            res.status(404).send("Username was not found");
            return;
        }
        //check if the user to assign referree is already referee
        const is_referee = await users_utils.isRole(ref_user_id,'referee');
        if(is_referee){
            res.status(401).send("user is already referee");
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
            res.status(404).send("Username was not found");
            return;
        }
        //check if the user to assign referree is already referee
        const is_referee = await users_utils.isRole(ref_user_id,'referee');
        if(!is_referee){
            res.status(401).send("To assign referee to a league, The should be already a referee");
        }
        else{
            await league_utils.assignRefereeToLeague(ref_user_id,'271')
            res.status(200).send("The referee was assigned to the league successfully");
        }

    } 
    catch (error) {
        next(error);
    }

});

router.post("/match", async (req, res, next) => {
    try{
        // make sure both teams are in superleague
        let ht = await team_utils.getTeamsByName(req.body.home_team_name);
        let at = await team_utils.getTeamsByName(req.body.away_team_name);
        if (ht.length == 0 || at.length == 0){
            res.status(404).send("one of the params you listed was not found");
            return;
        }
        let home_team = ht[0];
        let away_team = at[0];
        // let home_team_leagues = await league_utils.getleaguesOfTeam(home_team.id);
        // let away_team_leagues = await league_utils.getleaguesOfTeam(away_team.id);
        let league_id = await league_utils.getLeagueId();
        // if (!home_team_leagues.includes(league_id) || !away_team_leagues.includes(league_id)){
        //     res.status(404).send("one of the params you listed was not found");
        //     return;
        // }
        // make sure no games are set in this day
        // let number_of_home_team_matches = await team_utils.teamMatchesOnDay(home_team_id, req.body.date).length;
        // let number_of_away_team_matches = await team_utils.teamMatchesOnDay(away_team_id, req.body.date).length;
        // if (number_of_home_team_matches>0 || number_of_away_team_matches>0){
        //     res.status(404).send("one of the params you listed was not found");
        //     return;
        // }
        // make sure ref is in league
        // let ref_id = await users_utils.getUserIdByUsername(req.body.referee_name);
        // let number_ref_matches = (await users_utils.getRefLeague(ref_id)).length;
        // if (number_ref_matches == 0){
        //     res.status(404).send("one of the params you listed was not found");
        //     return;
        // }
        // 4) make sure he dosent have a match in that day
        // 5) check latest fixture of teams and assign it to the new match
        // check court of home team
        // let match_court = await team_utils.getTeamsCourt(req.body.home_team_name);
        let match_court = home_team.venue_id
        // add match (home team, away team, ref, court, date, fixture)
        match_utils.addMatch({
            home_team: req.body.home_team_name,
            away_team: req.body.away_team_name,
            league_id: league_id,
            season: "2020/2021",
            fixture: 0,
            court: match_court,
            referee_name: req.body.referee_name,
            date: req.body.date,
            score: ""
         })
         res.status(201).send("match has been created");


    }
    catch (error) {
        next(error);
    }

});


module.exports = router;
