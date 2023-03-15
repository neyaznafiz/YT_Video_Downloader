const express = require('express')
const app = express()
const cors = require('cors')

const port = 5000

app.use(express.json())
app.use(cors())


app.get('/', (req,res) => {
    res.send('Hello Downloader')
})

app.listen(port, ()=> {
    console.log(`Downloader app server is running on port ${port}`)
})