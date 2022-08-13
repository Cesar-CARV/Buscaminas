class Board{
    constructor(canvas, dificulty, overview, colors){
        // diccionaries
        this.SIZES = {easy: {y:10, x: 15}, normal: {y:12, x: 23}, medium: {y:15, x: 30}, hard: {y:15, x: 35}}
        this.MINES = {easy: 25, normal: 40, medium: 80, hard: 130}
        this.BOXES = {easy: 50, normal: 40, medium: 30, hard: 30}
        this.COLORS = colors;

        // constants of board
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.dificulty = dificulty;
        this.overview = overview;

        // variables
        this.time = this.time = {min: 0, seg: 0};;
        this.flags = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.minesFlag = 0;
        this.timeLoop;
        this.mines;
        this.size;
        this.box;
        
        this.gameOver = false;

        this.board;
        this.initialize();
    }

    initialize = () => {
        this.mines = this.MINES[this.dificulty];
        this.size = this.SIZES[this.dificulty];
        this.box = this.BOXES[this.dificulty];
        this.gameOver = false;
        this.minesFlag = 0;
        this.flags = 0;
        this.time = {min: 0, seg: 0};
        clearInterval(this.timeLoop);
        this.timeLoop = undefined;

        this.updateOverview();

        // initialize board
        this.board = new Array();
        this.resized();
        this.createBoard();
        this.fillBoard();
        this.draw();
    }

    updateOverview = () => {
        this.overview.lessMines.innerText = this.mines;
        this.overview.flags.innerText = this.flags;

        if (this.time.seg >= 60){
            this.time.min ++;
            this.time.seg = 0;
        }

        this.overview.time.innerText = `${this.time.min < 10 ? "0" + this.time.min : this.time.min}:${this.time.seg < 10 ? "0" + this.time.seg : this.time.seg}`;
    }

    setupTime = () =>{
        if (this.timeLoop === undefined){
            this.timeLoop = setInterval(()=> {this.time.seg ++;this.updateOverview();}, 1000);
        }
        else{
            clearInterval(this.timeLoop);
            this.timeLoop = undefined;
        }
    }

    iter = (cb) => {
        for (let y = 0; y < this.board.length; y++){
            for (let x = 0; x < this.board[y].length; x++){
                cb(x,y);
            }
        }
    }

    createBoard = () => {
        this.board = new Array(this.size.y);

        for (let i = 0; i < this.size.y; i++){
            this.board[i] = new Array(this.size.x);
        }
    }

    fillBoard = () => {
        this.iter((x,y) =>{
            this.board[y][x] = new Cell(this.canvas, this.board, x, y);
        });

        let i = 0;
        while (i < this.mines){
            let mineX = Math.floor(((Math.random() * (this.box * this.size.x)) + 1) / this.box);
            let mineY = Math.floor(((Math.random() * (this.box * this.size.y)) + 1) / this.box);

            mineX = mineX > this.size.x -1 ? this.size.x - 1: mineX;
            mineY = mineY > this.size.y -1 ? this.size.y - 1 : mineY;

            if (this.board[mineY][mineX].boomb === false){
                this.board[mineY][mineX].boomb = true;
                i ++;
            }
        }
    }

    draw = () => {
        this.iter((x, y) => {
            if (!this.gameOver){
                this.board[y][x].draw(this.ctx, this.box, this.COLORS);
            }
            else{
                this.board[y][x].flag = this.board[y][x].boomb ? false : this.board[y][x].flag;
                this.board[y][x].checked = this.board[y][x].boomb ? true : this.board[y][x].checked;
                this.board[y][x].draw(this.ctx, this.box, this.COLORS);
            }
        });
    }

    resized = (e) => {
        this.canvas.width = this.box * this.size.x;
        this.canvas.height = this.box * this.size.y;
    }

    gameOverFunc = () => {
        this.gameOver = true;
        this.setupTime();
        this.draw();

        this.ctx.fillStyle = "#f052";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#f05";
        this.ctx.font = "50px sans-serif";
        this.ctx.fillText("GAME OVER",
                          this.canvas.width / 2 - this.ctx.measureText("GAME OVER").width / 2,
                          this.canvas.height / 2);
    }

    wiinFunc = () => {
        this.gameOver = true;
        this.setupTime();
        this.draw();

        this.ctx.fillStyle = "#0a52";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#0a5";
        this.ctx.font = "50px sans-serif";
        this.ctx.fillText("WIIN!!",
                          this.canvas.width / 2 - this.ctx.measureText("WIIN!!").width / 2,
                          this.canvas.height / 2);
    }

    getMousePos = (e) => {
        let coords = e.target.getBoundingClientRect();
        this.mouseX = Math.floor((e.clientX - coords.left) / this.box);
        this.mouseY = Math.floor((e.clientY - coords.top) / this.box);

        this.mouseX = this.mouseX > this.size.x - 1 ? this.size.x - 1 : this.mouseX;
        this.mouseY = this.mouseY > this.size.y - 1 ? this.size.y - 1 : this.mouseY;
    }

    mouseMove = (e) =>{
        this.getMousePos(e);
        // hover effect
        this.board[this.mouseY][this.mouseX].hover();
    }

    mouseDown = (e) =>{
        this.getMousePos(e);

        if (this.gameOver){
            this.initialize();
            return;
        }

        if (this.timeLoop === undefined){
            this.setupTime();
        }

        if (e.button == 0){
            this.board[this.mouseY][this.mouseX].check(() => {this.gameOverFunc();});
            if (!this.gameOver){
                this.draw();
            }
        }
        if (e.button == 2){
            let limit = this.flags > this.mines - 1;

            this.board[this.mouseY][this.mouseX].checkFlag(limit,(flag, boomb) => {
                this.flags += flag ? +1 : -1;
                if (boomb && !flag){this.minesFlag --;}
                if (boomb && flag){this.minesFlag ++;}
            });

            if (!this.gameOver){
                this.draw();

                if (this.minesFlag === this.flags && this.minesFlag === this.mines){
                    this.wiinFunc();
                }
            }

            this.updateOverview();
        }
    }
}