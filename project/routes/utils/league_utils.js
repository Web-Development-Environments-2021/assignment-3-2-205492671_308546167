const axios = require("axios");
const DButils = require("./DButils");
const LEAGUE_ID = 271;
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function getLeagueDetails() {
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  const stage = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
    // next game details should come from DB
  };
}

async function getLeagueId() {
  return LEAGUE_ID;
}

async function assignRefereeToLeague(ref_user_id, league_id) {
  await DButils.execQuery(
    `INSERT INTO league_referees VALUES('${ref_user_id}','${league_id}')`
  );
}

async function getleaguesOfTeam(team_id){
  const leagues = await axios.get(`${api_domain}/teams/${team_id}/current`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  league_ids = [];
  leagues.data.data.map(l => league_ids.push(l.league_id));
  return league_ids;
}

async function getLeagueMatches(league_id){
  const matches = await DButils.execQuery(
    `SELECT * FROM match WHERE league = '${league_id}'`
  );
  return matches;
}


exports.getLeagueDetails = getLeagueDetails;
exports.getLeagueId= getLeagueId;
exports.assignRefereeToLeague = assignRefereeToLeague;
exports.getleaguesOfTeam = getleaguesOfTeam;
exports.getLeagueMatches = getLeagueMatches;
