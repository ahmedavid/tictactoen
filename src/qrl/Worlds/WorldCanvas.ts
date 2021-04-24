const CELL_SIZE = 20

export class WorldCanvas {
    agentPos = {x:-1,y:-1}
    constructor(private ctx: CanvasRenderingContext2D, private rows: number, private cols: number) {
    }

    drawQMap(qctx: CanvasRenderingContext2D, q: number[][]) {
        for(let row=0;row < 1600;row++) {
            for(let col=0;col < 1600;col++) {
                // qctx.strokeRect(col*CELL_SIZE,row*CELL_SIZE,CELL_SIZE,CELL_SIZE)
                const qVal = q[row][col]
                if(q[row][col] === 0) {
                    qctx.fillStyle = "yellow"
                } else {
                    qctx.fillStyle = "red"
                    qctx.fillRect(col,row,10,10)
                }
                // qctx.fillRect(col,row,1,1)
                // this.ctx.fillText(counter.toString(),col*CELL_SIZE,row*CELL_SIZE)
            }
        }
        // qctx.scale(8,8)
    }

    drawBoard() {
        this.ctx.fillStyle = "black"
        let counter = 0
        for(let row=0;row < this.rows;row++) {
            for(let col=0;col < this.cols;col++) {
                this.ctx.strokeRect(col*CELL_SIZE,row*CELL_SIZE,CELL_SIZE,CELL_SIZE)
                // this.ctx.fillText(counter.toString(),col*CELL_SIZE,row*CELL_SIZE)
                counter++
            }
        }
    }

    drawReward(rewardMatrix: number[][]) {
        this.ctx.fillStyle = "black"
        for(let row=0;row < this.rows;row++) {
            for(let col=0;col < this.cols;col++) {
                if(rewardMatrix[row][col] >= 1) {
                    this.ctx.fillStyle= "green"
                    this.ctx.fillRect(col*CELL_SIZE,row*CELL_SIZE,6,6)
                }
                if(row === this.agentPos.x && col === this.agentPos.y) {
                    this.ctx.fillStyle= "yellow"
                    this.ctx.fillText(rewardMatrix[row][col].toFixed(1),col*CELL_SIZE,row*CELL_SIZE+ 15)
                    this.ctx.fillStyle= "black"
                } else {
                    this.ctx.fillText(rewardMatrix[row][col].toFixed(1),col*CELL_SIZE,row*CELL_SIZE+ 15)
                }

                if(rewardMatrix[row][col] < -0.3) {
                    this.ctx.strokeStyle = 'red'
                    this.ctx.strokeRect(col*CELL_SIZE,row*CELL_SIZE,CELL_SIZE,CELL_SIZE)
                    this.ctx.strokeStyle = 'black'
                }

            }
        }
    }

    drawAgent(row:number,col:number) {
        this.agentPos.x = row
        this.agentPos.y = col
        this.ctx.fillStyle = "blue"
        this.ctx.fillRect(col*CELL_SIZE,row*CELL_SIZE,CELL_SIZE,CELL_SIZE)
    }

    clearAgent(row:number,col:number) {
        this.ctx.fillStyle = "white"
        this.ctx.strokeStyle = "black"
        this.ctx.fillRect(col*CELL_SIZE,row*CELL_SIZE,CELL_SIZE,CELL_SIZE)
        this.ctx.strokeRect(col*CELL_SIZE,row*CELL_SIZE,CELL_SIZE,CELL_SIZE)
    }

    clearBoard() {
        this.ctx.fillStyle = "white"
        this.ctx.fillRect(0,0,800,800)
    }
}