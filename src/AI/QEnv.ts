import { WorldCanvas } from "../qrl/Worlds/WorldCanvas"
import { APIClient, IDirection } from "../utils/APIClient"

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

interface IPersistedWorld {
    world: number[][]
    q: number[][]
}

export class QEnv {
    storageName = ''
    world : number[][] = []
    q: number[][] = []

    private constructor(private worldName:string, private worldSize:number, private renderer: WorldCanvas, private apiClient: APIClient) {
        this.storageName = 'world_'+this.worldName

    }

    static async initEnvironment(worldName:string, worldSize:number, renderer: WorldCanvas,apiClient: APIClient) {
        const qEnv = new QEnv(worldName,worldSize,renderer,apiClient)
        await qEnv.init()
        return qEnv
    }

    async init() {
        const obj = await this.retrieve()
        if(obj.world.length === 0) {
            this.world = makeMatrix(40)
            this.q = makeMatrix(40*40)
        } else {
            this.world = obj.world.slice()
            this.q = obj.q.slice()
        }
        this.drawRewards()
    }

    getActions(x:number, y:number) {
        const actions:{reward:number,dir:IDirection}[] = []

        if(x+1 <  this.worldSize) actions.push({reward:this.world[x+1][y],dir:'E'})
        if(x-1 >= 0 ) actions.push({reward:this.world[x-1][y],dir:'W'})
        if(y-1 >= 0 ) actions.push({reward:this.world[x][y-1],dir:'S'})
        if(y+1 < this.worldSize ) actions.push({reward:this.world[x][y+1],dir:'N'})

        return actions
    }
    
    drawRewards() {
        this.renderer.drawReward(this.world)
    }

    setReward(row: number,col: number, reward: number) {
        this.world[row][col] = reward
    }

    // async retrieve() {
    //     const world = await this.persistence.getWorld(this.worldName)
    //     if(world) {
    //         const obj = JSON.parse(world.data)
    //         return obj
    //     }
    //     return {world:[],q:[]}
    // }

    // persist() {
    //     const obj = {world: this.world, q: this.q}
    //     this.persistence.saveWorld(this.worldName,JSON.stringify(obj))
    // }

    persist() {
        const data = {world: this.world, q: this.q}
        this.apiClient.saveWorld(this.storageName,data)
        //localStorage.setItem(this.storageName, JSON.stringify(obj))
        
    }

    retrieve() {
        return new Promise<IPersistedWorld>((res,rej) => {
            // const str = localStorage.getItem(this.storageName)
            this.apiClient.getWorld(this.storageName).then(data => {
                if(data) {
                    const obj = JSON.parse(data.data)
                    return res(obj)
                }
                return res({world:[],q:[]})
            })
        })
    }

    onDestroy() {
        this.persist()
    }
}