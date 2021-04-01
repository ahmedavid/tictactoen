import { getCoords } from "../utils/interfaces"

export class Canvas {
    constructor(
        private ctx: CanvasRenderingContext2D,
        private width:number,
        private height:number,
        private rows:number,
        private cols:number,
        ) {}

    clearBoard() {
        this.ctx.fillStyle = "#000000"
        this.ctx.fillRect(0,0,this.width,this.height)
    }

    // renderBoard(state: number[]) {
    //     this.drawBoard()
    //     //const n = this.width / this.rows
    //     const len = Math.floor(Math.sqrt(state.length))

    //     // draw moves
    //     for(let index=0;index<state.length;index++) {
    //         const {i,j} = getCoords(index,len)
    //         debugger
    //         if(state[index] === 1) {
    //             this.drawX(i,j)
    //         }
    //         else if(state[index] === -1) {
    //             this.drawO(i,j)
    //         }
    //     }

    // }

    drawBoard() {
        const n = this.width / this.rows
        // Board background
        this.ctx.fillStyle = "#000000"
        this.ctx.fillRect(0,0,this.width,this.height)

        this.ctx.fillStyle = "#fff"
        this.ctx.strokeStyle = "#000"
        for(let x=0;x<this.cols;x++) {
            for(let y=0;y<this.rows;y++) {
                this.ctx.fillRect(x*n,y*n,n,n)
                this.ctx.strokeRect(x*n,y*n,n,n)
            }
        }
    }

    drawX(x:number, y:number) {
        const n = this.width / this.rows
        this.ctx.save()
        this.ctx.fillStyle = "blue"
        this.ctx.font = "52px Arial";
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.ctx.fillText("X",y*n+n/2,x*n + n/2,)
        this.ctx.restore()
    }

    drawO(x:number, y:number) {
        const n = this.width / this.rows
        this.ctx.save()
        this.ctx.fillStyle = "red"
        this.ctx.font = "52px Arial";
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.ctx.fillText("O",y*n + n/2,x*n + n/2)
        this.ctx.restore()
    }
}

