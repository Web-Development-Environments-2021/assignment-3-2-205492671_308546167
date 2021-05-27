const DButils = require("./DButils");
const users_utils = require("./users_utils");

async function markPlayerAsFavorite(user_id, player_id) {
  await DButils.execQuery(
    `insert into FavoritePlayers values ('${user_id}',${player_id})`
  );
}

async function getFavoritePlayers(user_id) {
  const player_ids = await DButils.execQuery(
    `select player_id from FavoritePlayers where user_id='${user_id}'`
  );
  return player_ids;
}

async function getUserRoles(user_id) {
  const names_list = [];
  const roles = (
    await DButils.execQuery(
      `SELECT role_name FROM roles WHERE user_id = '${user_id}'`
    )
  );
  
  // check that user_id exists
  if (!roles) {
    throw { status: 404, message: "user_id doesn't exist" };
  }
  roles.map((role)=> names_list.push(role.role_name));
  return names_list;
}

async function assignRole(user_id, role_name) {
  await DButils.execQuery(
    `INSERT INTO roles VALUES('${user_id}','${role_name}')`
  );
}

async function getUserIdByUsername(username) {
  const user_id = await DButils.execQuery(
    `select user_id from users where username='${username}'`
  );
  if(!user_id){
    return "not found";
  }
  return user_id[0].user_id;
}

async function isRole(user_id, role_name) {
  let user_roles = []
  user_roles = await users_utils.getUserRoles(user_id);
  const is_referee = user_roles.find(element => element ==role_name);
  return is_referee;
}

exports.markPlayerAsFavorite = markPlayerAsFavorite;
exports.getFavoritePlayers = getFavoritePlayers;
exports.getUserRoles = getUserRoles;
exports.assignRole = assignRole;
exports.getUserIdByUsername = getUserIdByUsername;
exports.isRole = isRole;
