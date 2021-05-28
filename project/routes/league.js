var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const users_utils = require("./utils/users_utils");

router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});

router.use("/assign_referee", async function(req,res,next){
  try{
    const user_id = req.session.user_id;
    const is_union_rep = await users_utils.isRole(user_id,'union_rep');
    if(!is_union_rep){
      res.status(401).send("Only union representatives allow to assign referee to league");
    }
    next();
  }
  catch (error) {
    next(error);
  }
  
});
router.put("/assign_referee", async (req, res, next)=>{
  try{
    const ref_user_id = await users_utils.getUserIdByUsername(req.body.username);
    if(ref_user_id == "not found"){
      res.status(404).send("Username was not found");
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

  } catch (error) {
      next(error);
  }

});

module.exports = router;
