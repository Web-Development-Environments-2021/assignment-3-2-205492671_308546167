const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad",
      api_token: process.env.api_token,
    },
  });
  team.data.data.squad.data.map((player) =>
    player_ids_list.push(player.player_id)
  );
  return player_ids_list;
}

async function getPlayersInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  return extractRelevantPlayerData(players_info);
}

function extractRelevantPlayerData(players_info) {
  return players_info.data.data.map((player_info) => {
    const { player_id,  fullname, image_path, position_id} = player_info;
    let team_name = "None";
    if (player_info.team){
      team_name = player_info.team.data.name;
    }
    return {
      player_id: player_id,
      fullname: fullname,
      picture: image_path,
      position_num: position_id,
      team_name: team_name,
    };
  });
}

function extractFullPlayerData(player_info){
  const { player_id,  fullname, image_path, position_id, common_name, nationality, birthdate, birthcountry, weight} = player_info.data.data;
    let team_name = "None";
    if (player_info.team){
      team_name = player_info.team.data.name;
    }
    return {
      player_id: player_id,
      fullname: fullname,
      picture: image_path,
      position_num: position_id,
      team_name: team_name,
      common_name: common_name, 
      nationality: nationality,
      date_of_birth: birthdate,
      country: birthcountry,
      weight: weight
    };
}

async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  let players_info = await getPlayersInfo(player_ids_list);
  return players_info;
}

async function getPlayersByName(player_name) {
  const players = await axios.get(`${api_domain}/players/search/${player_name}`, {
    params: {
      include: "team",
      api_token: process.env.api_token,
    },
  });
  return extractRelevantPlayerData(players);
}


async function getPlayerFullInfo(players_id) {
  player_info = await axios.get(`${api_domain}/players/${players_id}`, {
    params: {
      api_token: process.env.api_token,
      include: "team",
    },
  });
  return extractFullPlayerData(player_info);
}



exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.getPlayersByName = getPlayersByName;
exports.getPlayerFullInfo = getPlayerFullInfo

