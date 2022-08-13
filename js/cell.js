class Cell{
    constructor(canvas, board, x, y){
        this.canvas = canvas;
        this.board = board;
        this.x = x;
        this.y = y;
        this.checked = false;
        this.flag = false;
        this.boomb = false;
        this.boombsNear = -1;
    }

    iter = (cb) => {
        for (let i = -1; i < 2; i++){
            for (let j = -1; j < 2; j++){
                if (this.x + j < 0){j = 0;}
                if (this.y + i < 0){i = 0;}
                if (this.x + j > this.board[0].length - 1){continue;}
                if (this.y + i > this.board.length - 1){continue;}

                cb(i , j);
            }
        }
    }

    hover = () => {
        if (!this.checked){
            this.canvas.style.cursor = "pointer";
        }
        else{
            this.canvas.style.cursor = "auto";
        }

    }

    boombs = () => {
        this.iter((i , j) => {
            if (this.board[this.y + i][this.x + j] !== this.board[this.y][this.x]){
                if (this.board[this.y + i][this.x + j].boomb){
                    this.boombsNear = this.boombsNear === -1 ? 0 : this.boombsNear; 
                    this.boombsNear++;
                }
            }
        });
    }

    check = (callback) => {
        if (this.flag){return;}

        if (this.boombsNear === -1){
            this.boombs();
            this.boombsNear = this.boombsNear !== -1 ? this.boombsNear : 0;
        }

        this.checked = true;

        if (!this.boomb){
            this.iter((i,j) => {
                if (this.board[this.y + i][this.x + j] !== this.board[this.y][this.x]){
                    if (this.boombsNear === 0 && !this.board[this.y + i][this.x + j].checked){
                        this.board[this.y + i][this.x + j].check();
                    }
                }
            });
                        
        }
        else{
            if (callback){
                callback();
            }
        }

    }

    checkFlag = (limit, callback) => {
        if (!this.checked){
            if (limit && this.flag === false){
                return;
            }

            this.flag = !this.flag;
            callback(this.flag, this.boomb);
        }
    }
    
    draw = (ctx, box, COLORS) => {
        // draw flag cell
        ctx.fillStyle = COLORS["cell"];
        ctx.fillRect(this.x * box, this.y * box, box, box);

        // draw circle (flag)
        ctx.fillStyle = COLORS["txt"];
        ctx.beginPath();
        ctx.arc(this.x * box + (box / 2), this.y * box + (box / 2), box / 4, 0, 2 * Math.PI);
        ctx.fill(); 
        ctx.closePath();

        // draw border
        ctx.strokeStyle = COLORS["br"];
        ctx.strokeRect(this.x * box, this.y * box, box, box);

        // if flag exit function
        if (this.flag){return;}

        // if cell is not checked
        if (!this.checked){
            // draw cell
            ctx.fillStyle = COLORS["cell"];
            ctx.fillRect(this.x * box, this.y * box, box, box);
            
            // draw border
            ctx.strokeStyle = COLORS["br"];
            ctx.strokeRect(this.x * box, this.y * box, box, box);
        }
        // if cell was checked
        else{
            // if cell is a boomb
            if (this.boomb){
                // draw cell
                ctx.fillStyle = COLORS["boomb"];
                ctx.fillRect(this.x * box, this.y * box, box, box);
    
                // draw border
                ctx.strokeStyle = COLORS["br"];
                ctx.strokeRect(this.x * box, this.y * box, box, box);
            }
            // if cell is not a boomb
            else{
                // draw background
                ctx.fillStyle = COLORS["bg"];
                ctx.fillRect(this.x * box, this.y * box, box, box);
                
                // draw text
                if (this.boombsNear > 0){
                    ctx.fillStyle = COLORS["txt"];
                    ctx.font = box / 2 + 'px sans-serif';
                    ctx.fillText(this.boombsNear, this.x * box + (box / 3) , this.y * box + (box * .7));
                }
            }
        }

        
    }

}