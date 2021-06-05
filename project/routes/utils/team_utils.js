const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const DButils = require("./DButils");

async function getTeamsByName(team_name) {
  try{
    const teams = await axios.get(`${api_domain}/teams/search/${team_name}`, {
      params: {
        api_token: process.env.api_token,
      },
    });
    return teams.data.data;
  }
  catch(error){
    throw({status: 404, message: "one of the teams was not found"});
  }
}
  
function extractRelevantTeamData(teams) {
    return teams.map((team_info) => {
        const {id, name, logo_path} = team_info;
        return {
          team_id: id,
          team_name: name,
          image: logo_path,
        };
    });
}

async function teamMatchesOnDay(team_name, date){
  const matches_in_date = await DButils.execQuery(
    `select match_id from match where date='${date}' AND (home_team = '${team_name}' OR away_team = '${team_name}')`
  );
  return matches_in_date;
} 

async function teamSeasonMatches(team_name, season){
  const matches = await DButils.execQuery(
    `select * from match where season='${season}' AND (home_team = '${team_name}' OR away_team = '${team_name}')`
  );
  return matches;
} 

async function getTeamsBySeasonId(season_id) {
  try{
  const teams = await axios.get(`${api_domain}/teams/season/${season_id}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  if (teams.data.data.length == 0){
    throw(error);
  }
  return teams.data.data; 
  }
  catch(error){
    throw({status: 404, message: "season_id not found"});
  }
}

exports.getTeamsByName = getTeamsByName;
exports.teamMatchesOnDay = teamMatchesOnDay;
exports.extractRelevantTeamData = extractRelevantTeamData;
exports.teamSeasonMatches = teamSeasonMatches;
exports.getTeamsBySeasonId = getTeamsBySeasonId;