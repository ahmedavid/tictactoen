const axios = require('axios')

const getData = async (url) => {
    const response = await axios.get(url)
    return response.data
}

const enterWorld = async (url,worldId,teamId) => {
    const params = new URLSearchParams()
    params.append('type', 'enter')
    params.append('worldId', worldId)
    params.append('teamId', teamId)
    const response = await axios.post(url,params)
    return response.data
}

const agentMove = async (url,worldId,teamId,direction) => {
    const params = new URLSearchParams()
    params.append('type', 'move')
    params.append('worldId', worldId)
    params.append('teamId', teamId)
    params.append('move', direction)
    const response = await axios.post(url,params)
    return response.data
}

module.exports = {getData,enterWorld,agentMove}