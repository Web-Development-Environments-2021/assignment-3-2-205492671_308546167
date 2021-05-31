const axios = require("axios");
const DButils = require("./DButils");
const match_utils = require("./match_utils");
const LEAGUE_ID = 271;
const LEAGUE_NAME = "SUPER LEAGUE";
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const CURRENT_SEASON = "2020/2021";

async function getLeagueDetails() {
  let current_fixture = await match_utils.getCurrentFixture(LEAGUE_ID);
  return {
    league_name: LEAGUE_NAME,
    season_name: CURRENT_SEASON,
    stage_name: current_fixture[0].fixture,
    match: current_fixture[0]
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
