import { IDirection, IMoveStatus, IPos } from "../utils/APIClient";
import { QEnv } from "./QEnv"

function getRandomInt(min:number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function QRL(q:number[][],state:number,action:number,reward:number,alfa:number,gamma:number) {
    const q_old = q[state][action]
    return q_old +  alfa * (reward + gamma* Math.max(...q[action]) - q_old)
}


const directions:IDirection[] = ['E','W','S','N']

type IGetReward = (dir:IDirection) => Promise<IMoveStatus|undefined> 

export class QAgent {
    constructor(private _pos: IPos, private env:QEnv, private getReward: IGetReward) {}

    public get pos() {
        return this._pos
    }

    async step() {
        const {action,dir} = this.chooseAction()
        const moveStatus = await this.getReward(dir)
        if(moveStatus) {
            const reward = moveStatus.reward
            const newPos = moveStatus.newState
            // if(newPos.x !== action.x && newPos.y !== action.y) {
            //     debugger
            // }
            this.env.world[newPos.x][newPos.y] += reward
            const stateIndex = this._pos.x*this.env.world.length + this._pos.y
            const actionIndex = newPos.x*this.env.world.length + newPos.y
            this.env.q[stateIndex][actionIndex] = QRL(this.env.q,stateIndex,actionIndex,reward,0.1,0.9)
            this._pos = {...newPos}

            return this.env.world[newPos.x][newPos.y]
        }
    }

    private chooseAction() {
        const env = this.env.world
        const {x,y} = this._pos
        const actions = []
        for(let dir of directions) {
            if(dir === 'N' && y+1 < env.length-1) actions.push({dir,action:{x,y:y+1}})
            else if(dir === 'S' && y-1 >=0) actions.push({dir,action:{x,y:y-1}})
            else if(dir === 'E' && x+1 < env.length-1) actions.push({dir,action:{x:x+1,y}})
            else if(dir === 'W' && x-1 > 0) actions.push({dir,action:{x:x-1,y}})
            else actions.push({dir,action:{x,y}})
        }

        let maxActionIndex = 0
        let maxAction = actions[0]
        for(let i=1;i<actions.length;i++) {
            const {x,y} = actions[i].action
            if(env[x][y] > env[maxAction.action.x][maxAction.action.y]) {
                maxAction = actions[i]
                maxActionIndex = i
            }
        }
        // if(Math.random() > 0.9) {
        //     const randInt = getRandomInt(0,actions.length-1)
        //     return actions[randInt]
        // }
        return maxAction
    }
}