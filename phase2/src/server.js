import express from 'express'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = process.env.PORT|| 6969

const __filename = fileURLToPath(import.meta.url)
const __dirname= dirname(__filename)

app.use(express.json())


app.use(express.static(path.join(__dirname,"../public")))
console.log("Hello world")


app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'public',"index.html"))
    res.sendFile
})

app.listen(PORT, ()=>{
    console.log(`Server has Start on port: ${PORT}`)
})