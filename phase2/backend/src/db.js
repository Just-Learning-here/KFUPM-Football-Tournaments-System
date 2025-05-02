import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

// Accessing the DATABASE
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
}).promise()

// use export so that you can use it in a different file 








// Tournament Admin Functions
async function addTournament(tr_id,tr_name,start_date,end_date) {
    const result=await pool.query("INSERT INTO tournament (tr_id,tr_name,start_date,end_date) VALUES(?,?,?,?)",[tr_id,tr_name,start_date,end_date])
    const id = result.tr_id
    return getTournament(id) 
}

// تجربة للميثود
/*const result_Tournament=await addTournament(7,"Graduates Tournament",new Date("2025-04-30"),new Date("2025-05-10"))
const tournament = await getTournament(7)
console.log(tournament)
*/


async function addTeam(team_id,team_name) {
        const result = pool.query("INSERT INTO team (team_id,team_name) VALUES(?,?)",[team_id,team_name])
        const id = result.team_id
        return getTeam(id)
}

//تجربة للميثود
/*const result_Team=await addTeam(1229,"ICS")
const team = await getTeam(1229)
console.log(team)*/





async function selectCaptain(match_no,team_id,player_id) {
    const result=await pool.query("INSERT INTO match_captain (match_no,team_id,player_captain) VALUES(?,?,?)",[match_no,team_id,player_id])
    return await getMatchCaptain()
}

//تجربة للميثود
// const result_Captain=await selectCaptain(1,1216,1003)
// const captains = await getMatchCaptain()
// console.log(captains)


// get a checker when an admin tries to approve a player join when the player is already in a team in that tournament 
async function approvePlayerJoin(player_id,team_id,tr_id) {
    const qualified=await isPlayerValid(player_id,tr_id)
    if(qualified){
        const result=await pool.query("INSERT INTO team_player (player_id,team_id,tr_id) VALUES(?,?,?)",[player_id,team_id,tr_id])
    }
    else{
        console.log("This player is already playing in this tournament")
    }
}

//approvePlayerJoin(1001,1216,1)


async function isPlayerValid(id,tr_id){
    const [players] = await pool.query('SELECT player_id FROM team_player WHERE tr_id=?',[tr_id])
    const qualified=false ;
    for (let index in players){
        if(players[index].player_id== id){
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

    


async function deleteTournament(tr_id) {
    await pool.query("DELETE FROM tournament WHERE tr_id=?  ",[tr_id])

}


//تجربة للميثود
// const result_Team=await deleteTournament(7)




// Guest Functions

// get team players



// getters 
async function getTournament(tr_id) {
    const [rows] = await pool.query('SELECT * FROM tournament WHERE tr_id=?',[tr_id])
    return rows[0]  
}
export async function getAllTournament() {
    const [rows] = await pool.query('SELECT * FROM tournament')
    return rows   
}

async function getTeam(team_id) {
    const [rows] = await pool.query('SELECT * FROM team WHERE team_id=?',[team_id])
    return rows[0]  
}


async function getMatches() {
    const [rows] = await pool.query('SELECT * FROM match_played')
    return rows  
}

async function getMatchCaptain() {
    const [rows] = await pool.query('SELECT * FROM match_captain')
    return rows  
}



// const result= await getMatches()
// console.log(result)






//System Functions

