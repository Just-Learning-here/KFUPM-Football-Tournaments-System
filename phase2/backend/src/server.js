import express from 'express'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'
import { getAllTournament } from './db.js'
import cors from 'cors'






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

app.listen(PORT, ()=>{
    console.log(`Server has Start on port: ${PORT}`)
})