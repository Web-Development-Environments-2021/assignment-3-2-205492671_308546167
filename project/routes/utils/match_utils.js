const DButils = require("./DButils");

async function addMatch(match){
    await DButils.execQuery(
        `INSERT INTO match (home_team, away_team, league, season, fixture, court, referee_name, date, score) VALUES
         ('${match.home_team}','${match.away_team}','${match.league_id}', '${match.season}',
        '${match.fixture}', '${match.court}', '${match.referee_name}', '${match.date}', NULL)`
      );    
}

async function getMatchEvents(match_ids){
  let promises = []
  match_ids.map(match =>  promises.push(DButils.execQuery(
    `SELECT * FROM events WHERE match_id = '${match}'`
  )));
  let events = await Promise.all(promises); 
  
  return events;
}

function getEventsByMatchId(match_id, events){
  let eventlog = events.find(function(eve){
     if(eve[0]){
       return eve[0].match_id == match_id;
      }
      else return false;
    });
  if (eventlog === undefined){
    return[];
  }
  return eventlog;
}

async function extractRelevantData(matches){
  let results = [];
  let match_ids = [];
  matches.map(match=>match_ids.push(match.match_id));
  let events = await getMatchEvents(match_ids);
  matches.map(match=>results.push({
    
    "match_id": match.match_id,
    "home_team": match.home_team,
    "away_team": match.away_team,
    "court": match.court,
    "season": match.season,
    "referee_name": match.referee_name,
    "date": match.date,
    "eventlog": getEventsByMatchId(match.match_id, events),
    "score": match.score
  }))
  return results;
}

async function getCurrentFixture(league_id){
  let current_matches = await DButils.execQuery(
      `SELECT * FROM match WHERE fixture = ( SELECT MAX(fixture) AS CF FROM match WHERE league = '${league_id}' AND score IS NOT NULL) ORDER BY date DESC`)
      if(current_matches.length == 0){
        current_matches = await DButils.execQuery(
          `SELECT * FROM match WHERE league = '${league_id}' AND fixture = 1  ORDER BY date DESC`)
      }
  return current_matches;
}

async function prePostMatches(all_matches){
  let matches = await extractRelevantData(all_matches);
  let post_played = [];
  let pre_played = [];

  matches.map(function(match) {
    if(match.score !=  null){
      post_played.push(match);
    }
    else{
      pre_played.push(match);
    }

  });
  const results = {  pre_played_matches: pre_played, post_played_match: post_played};

  return results;
}


exports.extractRelevantData = extractRelevantData;
exports.addMatch = addMatch;
exports.getCurrentFixture = getCurrentFixture;
exports.prePostMatches = prePostMatches;
