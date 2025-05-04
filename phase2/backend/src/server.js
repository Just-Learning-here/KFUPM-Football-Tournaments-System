import express from 'express'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'
import { getAllTournament, getMatchesInCertainTournament, getRedCards, getScorers }  from './db.js'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()






const app = express()
const PORT = process.env.PORT|| 6969

app.use(cors());
const __filename = fileURLToPath(import.meta.url)
const __dirname= dirname(__filename)

app.use(express.json())


//app.use(express.static(path.join(__dirname,"..//phase2")))
console.log("Hello world")

const tournaments = await getAllTournament();
app.get('/tournament', (req,res) => {

    res.json(tournaments)
    console.log(tournaments)
    

})


app.get('/Matches', async(req,res) => {
    const tournamentId = parseInt(req.query.tr_id);

  if (!tournamentId) {
    return res.status(400).json({ error: "Tournament ID is required" });
  }

  
  

  try {
    const matches = await getMatchesInCertainTournament(tournamentId)
    const formattedResults = matches.map(row => ({
      ...row,
      play_date: new Date(row.play_date).toISOString().slice(0, 10)
    }));
  
    res.json(formattedResults);
    
    //res.json(matches)
    //console.log(matches)
  } catch (err) {
    console.error('Query failed:', err);
    res.status(500).json({ error: 'Database query failed' });
  }

  


    
    

})

const scorers = await getScorers();
app.get('/Scorers', (req,res) => {

    res.json(scorers)
    console.log(scorers)
    

})


const redCards = await getRedCards();
app.get('/redCards', (req,res) => {

    res.json(redCards)
    console.log(redCards)
    

})


app.listen(PORT, ()=>{
    console.log(`Server has Start on port: ${PORT}`)
})