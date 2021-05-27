const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

async function getTeamsByName(team_name) {
    const teams = await axios.get(`${api_domain}/teams/search/${team_name}`, {
      params: {
        api_token: process.env.api_token,
      },
    });
    return extractRelevantTeamData(teams);
  }
  
function extractRelevantTeamData(teams) {
    return teams.data.data.map((team_info) => {
        const { name, logo_path} = team_info;
        return {
        team_name: name,
        image: logo_path,
        };
    });
}


exports.getTeamsByName = getTeamsByName;