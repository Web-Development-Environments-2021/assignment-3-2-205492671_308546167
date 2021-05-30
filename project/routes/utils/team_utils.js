const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const DButils = require("./DButils");

// const TEAM_ID = "85";

async function getTeamId(team_name) {
  const team = await axios.get(`${api_domain}/teams/search/${team_name}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  return team.data.data[0].id;
}


async function getTeamsByName(team_name) {
    const teams = await axios.get(`${api_domain}/teams/search/${team_name}`, {
      params: {
        api_token: process.env.api_token,
      },
    });
    return teams.data.data;
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

async function teamMatchesOnDay(team_id, date){
  const matches_in_date = await DButils.execQuery(
    `select match_id from match where date='${date}' AND (home_team = '${team_id} OR away_team = '${team_id}')'`
  );
  return matches_in_date;
} 

async function getTeamsCourt(team_name) {
  const teams = await axios.get(`${api_domain}/teams/search/${team_name}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  return teams.data.data[0].venue_id;
}


exports.getTeamsByName = getTeamsByName;
exports.teamMatchesOnDay = teamMatchesOnDay;
exports.extractRelevantTeamData = extractRelevantTeamData;