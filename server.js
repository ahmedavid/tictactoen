const axios = require('axios')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const { getData,enterWorld,agentMove } = require('./server_files/qrl')
const { writeFileSync,readFileSync,existsSync } = require('fs')
const multer = require('multer')
const upload = multer()
const app = express()

app.use(bodyParser({limit: '50mb',extended: true}))
app.use('/',express.static(path.join(__dirname,'build')))
app.use('/worlds',express.static(path.join(__dirname,'server_files/worlds')))
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
const BASE_URL_RL = 'https://www.notexponential.com/aip2pgaming/api/rl/gw.php'
const BASE_URL_RL_SCORE = 'https://www.notexponential.com/aip2pgaming/api/rl/score.php'
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

// const getGame = async (gameId) => {
//     // const response = await axios.get(`${BASE_URL}?type=moves&gameId=${gameId}&count=20`)
//     const response = await axios.get(`${BASE_URL}?type=moves&gameId=${gameId}`)

//     console.log("BOARD MAP: ", boardMapRes.data)
//     console.log("BOARD STR: ", boardStringRes.data)

//     return response.data
// }

const getBoard = async (gameId) => {
    setHeaders()
    const response = await axios.get(`${BASE_URL}?type=boardString&gameId=${gameId}`)
    // const mapResponse = await axios.get(`${BASE_URL}?type=boardMap&gameId=${gameId}`)

    return response.data
}

const createGame = async (teamId1,teamId2,boardSize,target) => {
    console.log("Team1:",teamId1,"Team2:",teamId2)
    try {
        const params = new URLSearchParams()
        params.append('type', 'game')
        params.append('teamId1', teamId1)
        params.append('teamId2', teamId2)
        params.append('gameType', 'TTT')
        params.append('boardSize', boardSize)
        if(target)
            params.append('target', target)
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

const PORT = process.env.PORT || 8080




// QRL Routes
app.get('/qrl/getworld', async (req,res) => {
    const worldName = req.query['worldName']
    const fileName = path.join(__dirname + '/server_files/worlds/'+worldName)
    if(false && existsSync(fileName)) {
        const file = readFileSync(fileName,'utf-8')
        return res.json({code:'OK',data:file})
    }
    return res.json({code:'OK',data:null})
})

app.post('/qrl/uploadworld',upload.any() ,(req,res) => {
    const worldName = req.files[0].originalname
    const buffer = req.files[0].buffer
    const fileName = path.join(__dirname + '/server_files/worlds/'+worldName)
    try {
        writeFileSync(fileName,buffer)
        res.json({code: "OK"})
    } catch (error) {
        res.json({code: "FAIL"})
    }
})

app.post('/qrl/saveworld',(req,res) => {
    const {worldName,data} = req.body
    const fileName = path.join(__dirname + '/server_files/worlds/'+worldName+'.txt')
    const str = JSON.stringify(data)
    writeFileSync(fileName,str)
    return res.json({code: 'OK'})
})

app.get('/qrl/getlocation', async (req,res) => {
    const data = await getData(`${BASE_URL_RL}?type=location&teamId=1243`)
    console.log("Location:" , data)
    res.json(data)
})

app.get('/qrl/getruns', async (req,res) => {
    const {teamId} = req.query
    const data = await getData(`${BASE_URL_RL_SCORE}?type=runs&teamId=${teamId}&count=10`)
    console.log("Runs:" , data)
    res.json(data)
})

app.post('/qrl/enterworld', async (req,res) => {
    const {worldId, teamId} = req.body
    const data = await enterWorld(BASE_URL_RL,worldId,teamId)
    console.log("Enter World:" , data)
    res.json(data)
})

app.post('/qrl/move', async (req,res) => {
    const {worldId, teamId,move} = req.body
    const data = await agentMove(BASE_URL_RL,worldId,teamId,move)
    res.json(data)
})












app.get('/game/id', async (req,res) => {
    const gameId = req.params[id]
    // const data = await getGame(1310)
    const data = await getGame(gameId)
    console.log("game data: ", data)
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
    console.log("GAME LIST: ", data.myGames.length)
    res.json(data)
})

app.get('/*', async (req,res) => {
    res.redirect('/')
})


app.post('/creategame', async (req,res) => {
    const {team1Id,team2Id,boardSize,target} = req.body
    // const boardSize = req.query['boardSize']
    console.log("Board Size: ",team1Id,team2Id,boardSize,target)
    const data = await createGame(team1Id,team2Id,boardSize,target)
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
        // console.log(response.data)

        if(response.data.code === "FAIL") {
            console.log("Move error: ",response.data)
            return res.json({code: "FAIL", moveId: -1})
        }
        
        return res.json(response.data)
    } catch (error) {
        console.log("Move error: ",error)  
        return res.json({code: "FAIL", moveId: -1})
    }
})

app.listen(PORT, () => console.log('Server running on port ', PORT))
