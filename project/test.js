const player_utils = require("./routes/utils/players_utils");
async function ()
let res = await player_utils.getPlayersBySeasonId('18334');
let q=0;