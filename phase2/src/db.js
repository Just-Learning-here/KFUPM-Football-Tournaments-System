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
    
}

async function approvePlayerJoin() {
    
}

async function deleteTournament() {
    
}


// Guest Functions


// getters 
async function getTournament(tr_id) {
    const [rows] = await pool.query('SELECT * FROM tournament WHERE tr_id=?',[tr_id])
    return rows[0]  
}

async function getTeam(team_id) {
    const [rows] = await pool.query('SELECT * FROM team WHERE team_id=?',[team_id])
    return rows[0]  
}


async function getMatches() {
    const [rows] = await pool.query('SELECT * FROM match_played')
    return rows  
}

const result= await getMatches()
console.log(result)




//System Functions

