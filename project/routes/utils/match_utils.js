const DButils = require("./DButils");

async function addMatch(match){
    await DButils.execQuery(
        `INSERT INTO match (home_team, away_team, league, season, fixture, court, referee_name, date, score) VALUES
         ('${match.home_team}','${match.away_team}','${match.league_id}', '${match.season}',
        '${match.fixture}', '${match.court}', '${match.referee_name}', '${match.date}', '${match.score}')`
      );    
}

exports.addMatch = addMatch