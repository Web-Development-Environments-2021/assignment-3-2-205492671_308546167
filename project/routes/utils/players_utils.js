const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  try{
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
  catch(error){
    throw({status: 404, message: "team id not found"});
  }
}

async function getPlayersInfo(players_ids_list) {
  try{
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
    let players_info_not_clean = await Promise.all(promises);
    let players_info = [];
    players_info_not_clean.map(player => players_info.push(player.data.data))
    return extractRelevantPlayerData(players_info);
  }
  catch(error){
    throw({status: 400, message: "server has encorred a problem"});
  }
}

function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
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
      team_name = player_info.data.data.team.data.name;
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
  return extractRelevantPlayerData(players.data.data);
}


async function getPlayerFullInfo(players_id) {
  try{
    player_info = await axios.get(`${api_domain}/players/${players_id}`, {
      params: {
        api_token: process.env.api_token,
        include: "team",
      },
    });
    return extractFullPlayerData(player_info);
  }
  catch(error){
    throw({status: 404, message: "player id not found"});
  }
}



exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.getPlayersByName = getPlayersByName;
exports.getPlayerFullInfo = getPlayerFullInfo

