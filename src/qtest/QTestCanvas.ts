const CELL_SIZE = 80

export class QTestCanvas {
    constructor(private ctx: CanvasRenderingContext2D, private rows: number, private cols: number) {}

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

    clearBoard() {
        this.ctx.fillStyle = "white"
        this.ctx.fillRect(0,0,600,600)
    }


    drawAgent(x:number,y:number) {
        this.ctx.fillStyle = "blue"
        this.ctx.fillRect(y*CELL_SIZE,x*CELL_SIZE,CELL_SIZE,CELL_SIZE)
    }

    drawPath(path:number[]) {
        for(let i=0;i<path.length;i++) {
            this.ctx.fillStyle = "orange"
            const x = Math.floor(path[i]/this.cols)
            const y = path[i]%this.cols
            this.ctx.fillRect(y*CELL_SIZE,x*CELL_SIZE,CELL_SIZE,CELL_SIZE)
        }
    }

    clearAgent(x:number,y:number) {
        this.ctx.fillStyle = "white"
        this.ctx.strokeStyle = "black"
        this.ctx.fillRect(y*CELL_SIZE,x*CELL_SIZE,CELL_SIZE,CELL_SIZE)
        this.ctx.strokeRect(y*CELL_SIZE,x*CELL_SIZE,CELL_SIZE,CELL_SIZE)
    }
}