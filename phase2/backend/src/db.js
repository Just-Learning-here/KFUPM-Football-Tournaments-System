import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Accessing the DATABASE
const pool = mysql
  .createPool({
    host: process.env.HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: 3306
  })
  .promise();

export { pool };

// use export so that you can use it in a different file

// Tournament Admin Functions
export async function addTournament(tr_name, start_date, end_date) {
  const [result] = await pool.query(
    "INSERT INTO tournament (tr_name, start_date, end_date) VALUES (?, ?, ?)",
    [tr_name, start_date, end_date]
  );
  const id = result.insertId;
  return getTournament(id);
}

// تجربة للميثود
/*const result_Tournament=await addTournament(7,"Graduates Tournament",new Date("2025-04-30"),new Date("2025-05-10"))
const tournament = await getTournament(7)
console.log(tournament)
*/

async function addTeam(team_id, team_name) {
  const result = pool.query(
    "INSERT INTO team (team_id,team_name) VALUES(?,?)",
    [team_id, team_name]
  );
  const id = result.team_id;
  return getTeam(id);
}

//تجربة للميثود
/*const result_Team=await addTeam(1229,"ICS")
const team = await getTeam(1229)
console.log(team)*/

export async function selectCaptain(match_no, team_id, player_id) {
  const isThereCaptain = await pool.query('select * from match_captain where match_no = ? and team_id =? ',[match_no,team_id])
  
  


  if (isThereCaptain.length >0){
    console.log("if case is the one worked")
    await pool.query("DELETE from match_captain where match_no = ? and team_id =? ",[match_no,team_id])
    await pool.query(
      "INSERT INTO match_captain (match_no,team_id,player_captain) VALUES(?,?,?)",
      [match_no, team_id, player_id]
    ); 


    //return await getMatchCaptain();
  }
  else {
    console.log("else is the one worked")
     await pool.query(
      "INSERT INTO match_captain (match_no,team_id,player_captain) VALUES(?,?,?)",
      [match_no, team_id, player_id]
    ); 
  }
  
}

//تجربة للميثود
// const result_Captain=await selectCaptain(1,1216,1003)
// const captains = await getMatchCaptain()
// console.log(captains)

// get a checker when an admin tries to approve a player join when the player is already in a team in that tournament
export async function approvePlayerJoin(player_id, team_id, tr_id) {
  const qualified = await isPlayerValid(player_id, tr_id);
  if (qualified) {
    const result = await pool.query(
      "INSERT INTO team_player (player_id,team_id,tr_id) VALUES(?,?,?)",
      [player_id, team_id, tr_id]
    );
    return true;
  } else {
    throw new Error("This player is already playing in this tournament");
  }
}

//approvePlayerJoin(1001,1216,1)

async function isPlayerValid(id, tr_id) {
  const [players] = await pool.query(
    "SELECT player_id FROM team_player WHERE tr_id=?",
    [tr_id]
  );
  for (let index in players) {
    if (players[index].player_id == id) {
      return false;
    }
  }
  return true;
}

// const checkResult=await isPlayerValid(1001,3)
// console.log(checkResult)

// const checkingMethod = await pool.query('SELECT player_id FROM team_player WHERE tr_id=1')

// const players=checkingMethod[0]
//  for (let player_id in players){
//  console.log(player_id.player_id)
//  console.log("no clue ")
//  }

export async function showMatchCaptain(match_no, team_id, tr_id) {
  const [rows] = await pool.query(
    "select match_no,tm.team_id,player_captain,p.name,tr_id from match_captain as mc JOIN person as p ON p.kfupm_id = mc.player_captain JOIN tournament_team as tm on tm.team_id=mc.team_id where match_no = ? and mc.team_id =? and tr_id=?;",
    [match_no, team_id, tr_id]
  );
  return rows;
}
//const capResult = await showMatchCaptain(1, 1214);
//console.log(capResult);

export async function showTeamStaff(team_id) {
  const [rows] = await pool.query(
    "select kfupm_id as id ,p.name,team_name, support_type from team_support as ts Join team as t ON t.team_id = ts.team_id JOIN person as p ON p.kfupm_id = ts.support_id where t.team_id=?;",
    [team_id]
  );
  return rows;
}

export async function showTeamPlayers(team_id) {
  //   const [rows] = await pool.query(
  //     "select p.name, t.team_id  from player pr JOIN team_player as tm ON tm.player_id = pr.player_id JOIN person p ON p.kfupm_id=pr.player_id Join team as t ON t.team_id = tm.team_id where tr_id=? and t.team_id = ?;",
  //     [tr_id, team_id]
  //   );

  const [rows] = await pool.query(
    "select distinct p.name, t.team_id, p.kfupm_id  from player pr JOIN team_player as tm ON tm.player_id = pr.player_id JOIN person p ON p.kfupm_id=pr.player_id Join team as t ON t.team_id = tm.team_id where  t.team_id = ?;",
    [team_id]
  );
  return rows;
}
//تجربة للميثود
// const result_Team=await deleteTournament(7)

// Guest Functions

// get team players

// getters
async function getTournament(tr_id) {
  const [rows] = await pool.query("SELECT * FROM tournament WHERE tr_id=?", [
    tr_id,
  ]);
  return rows[0];
}
export async function getAllTournament() {
  const [rows] = await pool.query("SELECT * FROM tournament");
  return rows;
}

async function getTeam(team_id) {
  const [rows] = await pool.query("SELECT * FROM team WHERE team_id=?", [
    team_id,
  ]);
  return rows[0];
}

async function getMatches() {
  const [rows] = await pool.query("SELECT * FROM match_played");
  return rows;
}

export async function getMatchesInCertainTournament(tr_id) {
  //const lengthOfTournaments = getAllTournament.length()
  // const[rows] = await pool.query('SELECT tm.tr_id, t1.team_name AS team1_name, t2.team_name AS team2_name, md.match_no, tm.team_group, mp.results,mp.goal_score,mp.play_date, t1.team_id as team_id1,t2.team_id as team_id2,md.match_no FROM match_played AS mp JOIN tournament_team AS tm ON mp.team_id1 = tm.team_id JOIN team AS t1 ON t1.team_id = mp.team_id1 JOIN team AS t2 ON t2.team_id = mp.team_id2 JOIN match_details AS md ON tm.team_id = md.team_id AND md.match_no = mp.match_no WHERE tm.tr_id = ? ORDER BY mp.play_date, tm.tr_id, md.team_id;',[tr_id])
  const [rows] = await pool.query(
    "SELECT tt1.tr_id,t1.team_name AS team1_name,t2.team_name AS team2_name,mp.match_no,mp.results,mp.goal_score,mp.play_date,t1.team_id AS team1_id,t2.team_id AS team2_id FROM match_played AS mp JOIN tournament_team AS tt1 ON mp.team_id1 = tt1.team_id JOIN tournament_team AS tt2 ON mp.team_id2 = tt2.team_id JOIN team AS t1 ON mp.team_id1 = t1.team_id JOIN team AS t2 ON mp.team_id2 = t2.team_id WHERE tt1.tr_id = ? AND tt2.tr_id = ? ORDER BY mp.play_date, mp.match_no;",
    [tr_id, tr_id]
  );

  return rows;
}

export async function getScorers() {
  // const [rows] = await pool.query(
  //   "select player_id,p.name, team_name ,sum(gd.match_no) AS Goals from goal_details as gd JOIN team as t ON t.team_id = gd.team_id JOIN person as p ON p.kfupm_id = gd.player_id group by player_id, team_name,p.name ;"
  // );
  const [rows] = await pool.query(
  `SELECT 
     gd.player_id, 
     p.name, 
     t.team_name, 
     COUNT(gd.match_no) AS Goals
   FROM 
     goal_details AS gd
     JOIN team AS t ON t.team_id = gd.team_id
     JOIN person AS p ON p.kfupm_id = gd.player_id
   GROUP BY 
     gd.player_id, t.team_name, p.name
   ORDER BY 
     Goals DESC
   LIMIT 1;`
);

  return rows;
}

export async function getRedCards() {
const [rows] = await pool.query(
  'SELECT p.name, t.team_name, COUNT(*) AS RedCards ' +
  'FROM player_booked AS pd ' +
  'JOIN team AS t ON t.team_id = pd.team_id ' +
  'JOIN person AS p ON p.kfupm_id = pd.player_id ' +
  'WHERE pd.sent_off = "Y" ' +
  'GROUP BY t.team_name, p.name ' +
  'ORDER BY t.team_name, RedCards DESC;' 
);


  return rows;
}

// In db.js
export async function deleteTournament(tr_id) {
  await pool.query("DELETE FROM tournament_team WHERE tr_id=?", [tr_id]);
  await pool.query("DELETE FROM tournament WHERE tr_id=?", [tr_id]);
}
//تجربة للميثود
// const resultOfMatchesInATournament = await getMatchesInCertainTournament(1)
// console.log(resultOfMatchesInATournament)

async function getMatchCaptain() {
  const [rows] = await pool.query("SELECT * FROM match_captain");
  return rows;
}
export async function verifyAdminCredentials(username, password) {
  const [rows] = await pool.query(
    "SELECT * FROM admin WHERE username = ? AND password = ?",
    [username, password]
  );

  // If we found a matching admin, return it, otherwise return null
  return rows.length > 0 ? rows[0] : null;
}
// const result= await getMatches()
// console.log(result)

//System Functions

export async function insertTeamById(team_id, team_name, tr_id) {
  try {
    // Check if the team_id already exists
    // const [[{ count }]] = await pool.query(
    //   'SELECT COUNT(*) AS count FROM team WHERE team_id = ?',
    //   [team_id]
    // );

    // if (count > 0) {
    //   return { success: false, message: 'Team ID already exists.' };
    // }

    // Begin transaction
    await pool.query("START TRANSACTION");

    // Insert into team with team_group
    await pool.query(
      "INSERT INTO team (team_id, team_name) VALUES (?, ?)", // Use placeholders
      [team_id, team_name]
    );

    // Insert into tournament_team
    await pool.query(
      "INSERT INTO tournament_team (tr_id, team_id) VALUES (?, ?)",
      [tr_id, team_id, "N", 0, 0, 0, 0, 0, 0, 0, 0, 1] // default for other values
    );

    // Commit transaction
    await pool.query("COMMIT");

    return { success: true, team_id };
  } catch (error) {
    // Rollback transaction in case of an error
    await pool.query("ROLLBACK");
    return { success: false, error: error.message };
  }
}

export async function getTeamsInTournament(tr_id) {
  const [rows] = await pool.query(
    "SELECT t.team_id, t.team_name FROM team t JOIN tournament_team tt ON t.team_id = tt.team_id WHERE tt.tr_id = ?",
    [tr_id]
  );
  return rows;
}

export async function getEligiblePlayersForTeam(team_id, tr_id) {
  // Return players who are not already in team_player for this team and tournament
  const [rows] = await pool.query(
    `SELECT p.kfupm_id, p.name
     FROM player pl
     JOIN person p ON p.kfupm_id = pl.player_id
     WHERE pl.player_id NOT IN (
       SELECT player_id FROM team_player WHERE team_id = ? AND tr_id = ?
     )`,
    [team_id, tr_id]
  );
  return rows;
}
