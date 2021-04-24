function getRandomInt(min:number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeMatrix(n: number) {
    const matrix: number[][] = []
    for(let i=0;i<n;i++) {
        matrix.push([])
        for(let j=0;j<n;j++) {
            matrix[i].push(0)
        }
    }
    return matrix
}

function QRL(q:number[][],state:number,action:number,reward:number,alfa:number,gamma:number) {
    const q_old = q[state][action]
    return q_old +  alfa * (reward + gamma* Math.max(...q[action]) - q_old)
}

function getActions(env: number[][],pos:{x:number,y:number}) {
    const SIZE = env.length
    const {x,y} = pos
    const actions = []
    if(x+1 < SIZE) actions.push({x:x+1,y:y})
    if(x-1 >= 0) actions.push({x:x-1,y:y})
    if(y+1 < SIZE) actions.push({x:x,y:y+1})
    if(y-1 >= 0) actions.push({x:x,y:y-1})

    return actions
}

function getMaxAction(env:number[][],actions:{x:number,y:number}[]) {
    let max = env[actions[0].x][actions[0].y]
    let maxIndex = 0

    for(let i=1;i<actions.length;i++) {
        let {x,y} = actions[i]
        let checkMax = env[x][y]
        if(checkMax > max) {
            max = checkMax
            maxIndex = i
        }
    }

    return maxIndex
}


type IDirection = 'E'|'W'|'S'|'N'
const directions:IDirection[] = ['E','W','S','N']

function chooseAction(env:number[][],pos:IPos) {
    const {x,y} = pos
    const actions = []
    for(let dir of directions) {
        if(dir === 'N' && y+1 < env.length) actions.push({x,y:y+1})
        else if(dir === 'S' && y-1 >=0) actions.push({x,y:y-1})
        else if(dir === 'E' && x-1 >=0) actions.push({x:x-1,y})
        else if(dir === 'W' && x+1 < env.length) actions.push({x:x+1,y})
        else actions.push({x,y})
    }

    let maxActionIndex = 0
    let maxAction = actions[0]
    for(let i=0;i<actions.length;i++) {
        const {x,y} = actions[i]
        if(env[x][y] > env[maxAction.x][maxAction.y]) {
            maxAction = actions[i]
            maxActionIndex = i
        }
    }
    if(Math.random() > 0.6) {
        const randInt = getRandomInt(0,actions.length-1)
        return actions[randInt]
    }
    return maxAction
}

interface IPos {
    x:number
    y:number
}

export class QTestAgent {
    env: number[][] = []
    q: number[][] = []

    constructor(private worldSize: number,private pos: IPos, private getReward: (x:number,y:number) => number) {
        this.env = makeMatrix(worldSize)
        this.q = makeMatrix(worldSize*worldSize)
        this.env[0][0] = getReward(0,0)
    }

    step() {
        // Choose a direction to go 'E'|'W'|'S'|'N' with best reward
        const action = chooseAction(this.env,this.pos)
        const reward = this.getReward(action.x,action.y)

        // update my reward table
        this.env[action.x][action.y] = reward

        const state = this.pos.x*this.worldSize + this.pos.y
        const actionIndex = action.x*this.worldSize + action.y
        this.learn(state,actionIndex,reward)

        this.pos = {...action}
        return reward
    }

    private learn(state:number,action:number,reward: number) {
        this.q[state][action] = QRL(this.q,state,action,reward,0.1,0.9)
    }

    traverse() {
        let score = 0
        this.pos = {x:0,y:0}
        let path = ''
        for(let i=0;i<100;i++) {
            score += this.env[this.pos.x][this.pos.y]
            let state = this.pos.x*this.worldSize + this.pos.y
            let maxIndex = 0
            let max = this.q[state][0]
            for(let j=0;j<this.q[state].length;j++) {
                if(this.q[state][j] > max) {
                    max = this.q[state][j]
                    maxIndex = j
                }
            }

            const newX = Math.floor(maxIndex/this.worldSize)
            const newY = maxIndex%this.worldSize
            this.pos = {x:newX,y:newY}

            path += `(${this.pos.x},${this.pos.y})`
        }

        console.log("Score:", score)
        console.log(path)
    }
}