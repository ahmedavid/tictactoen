const axios = require('axios')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const app = express()

app.use('/',express.static(path.join(__dirname,'build')))
app.use(bodyParser.json())
app.use(cors())

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    config.headers['x-api-key'] =  API_KEY
    config.headers['Content-Type'] =  'application/x-www-form-urlencoded'
    config.headers['userId'] = 1046

    return config;
});


const BASE_URL = 'https://www.notexponential.com/aip2pgaming/api/index.php'
const API_KEY = 'b50e09d24155e0aee7cc'

function setHeaders() {
    axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
    axios.defaults.headers.common['x-api-key'] = API_KEY
    axios.defaults.headers.common['userId'] = 1046
}

const getTeam = async () => {
    const response = await axios.get(`${BASE_URL}?type=team&teamId=1243`)

    return response.data
}

const getGame = async (gameId) => {
    // const response = await axios.get(`${BASE_URL}?type=moves&gameId=${gameId}&count=20`)
    const response = await axios.get(`${BASE_URL}?type=moves&gameId=${gameId}`)

    return response.data
}

const getBoard = async (gameId) => {
    setHeaders()
    const response = await axios.get(`${BASE_URL}?type=boardString&gameId=${gameId}`)

    console.log(response.data)

    return response.data
}

const createGame = async (teamId1,teamId2,boardSize) => {
    try {
        const params = new URLSearchParams()
        params.append('type', 'game')
        params.append('teamId1', teamId1)
        params.append('teamId2', teamId2)
        params.append('gameType', 'TTT')
        params.append('boardSize', boardSize)
        const response = await axios.post(BASE_URL,params)
        return response.data
    } catch (error) {
        console.log(error)        
    }
}

const gameList = async () => {
    const response = await axios.get(`${BASE_URL}?type=myGames`)
    return response.data
}

const makeMove = async (gameId, teamId,move) => {

} 

const PORT = process.env.PORT || 8080

app.get('/game/id', async (req,res) => {
    const gameId = req.params[id]
    // const data = await getGame(1310)
    const data = await getGame(gameId)
    res.json(data)
})

app.get('/board', async (req,res) => {
    try {
        const gameId = req.query['gameId']
        const data = await getBoard(gameId)
        res.json(data)
    } catch (error) {
        res.json({
            output: '------\n-O----\n------\n------\n------\n------\n',
            target: 6,
            code: 'OK'
          })
    }

})

app.get('/gamelist', async (req,res) => {
    const data = await gameList()
    console.log("GAME LIST: ", data)
    res.json(data)
})


app.post('/creategame', async (req,res) => {
    const boardSize = req.query['boardSize']
    console.log("Board Size: ",boardSize)
    const teamId1 = 1243
    const teamId2 = 1246
    const data = await createGame(teamId1,teamId2,boardSize)
    console.log(data)
    res.json(data)
})

app.post('/move', async (req,res) => {
    const {teamId,gameId,move} = req.body
    console.log(teamId,gameId,move)

    try {
        const params = new URLSearchParams()
        params.append('type', 'move')
        params.append('gameId', gameId)
        params.append('teamId', teamId)
        params.append('move', move)
        const response = await axios.post(BASE_URL,params)
        console.log(response.data)

        if(response.data.code === "FAIL")
            return res.json({code: "FAIL", moveId: -1})
        
        return res.json(response.data)
    } catch (error) {
        console.log(error)  
        return res.json({code: "FAIL", moveId: -1})
    }
})

app.listen(PORT, () => console.log('Server running on port ', PORT))
