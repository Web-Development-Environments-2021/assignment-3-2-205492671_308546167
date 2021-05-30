const match_utils = require("./routes/utils/match_utils");

const match_entry = {
    home_team: undefined,
    away_team: undefined,
    league: {
    },
    season: "2020/2021",
    fixture: 0,
    court: undefined,
    referee_name: undefined,
    date: "2021-05-30T16:55:47.041Z",
    score: "",
  }

  match_utils.addMatch(match_entry);