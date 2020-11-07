'use strict'; 
console.log('Game file')

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.x = 0; //para el background en movimiento
        this.speed = -1; // para el background en movimiento
        this.diver; 
        this.sharks = [];
        this.treasure = [];
        this.fish = [];
        this.points = setInterval(() => {
            this.points += 1
        }, 100);
        this.air = [];
        this.remainingAir = 60;
        this.tiempo = setInterval(() => {
            this.remainingAir -= 1
        }, 1000);
        this.isGameOver = false;
        console.log(this.points)
    }

    updateCanvas() {
        this.moveBackground()
        this.checkRemainingAir()
        this.diver.updateY()
        this.diver.updateX()
        this.sharks.forEach((shark) => {
            shark.update()
        })
        this.treasure.forEach((tre) => {
            tre.update()
        })
        this.fish.forEach((fi) => {
            fi.update()
        })
        this.air.forEach((a) => {
            a.update()
        })
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    drawCanvas() {
        this.drawBackground()
        this.drawLives()
        this.drawRemainingAir()
        this.diver.draw()
        this.sharks.forEach((shark) => {
            shark.draw();
        })
        this.drawLives()
        this.drawScore()
        this.drawLives()
        this.treasure.forEach((tre) => {
            tre.draw();
        })
        this.fish.forEach((fi) => {
            fi.draw();
        })
        this.air.forEach((a) => {
            a.draw();
        })
    }

    drawScore() {
        this.ctx.font = "bold 18px arial"
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(`Score: ${this.points}`, this.canvas.width - 250, 40)
    }

    drawBackground() {
        let imgBack = new Image() 
        imgBack.src = './images/background.jpg'
        this.ctx.drawImage(imgBack, 0, 0)
            if (this.speed < 0) {
                this.ctx.drawImage(imgBack, this.x + this.canvas.width, 0);
            } else {
                this.ctx.drawImage(imgBack, this.x - imgBack.width, 0);
            }
    }
    moveBackground() {
        this.x += this.speed;
        this.x %= this.canvas.width;
    }


    drawLives(){
        let imgLives = new Image() 
        imgLives.src = '/PROJECTS/PROJECT 1/Project-1-Ironhack-/images/cor.png'
        this.ctx.drawImage(imgLives, this.canvas.width - 100, 25, 20, 20)
        this.ctx.font = "bold 18px arial"
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(`${this.diver.lives}`, this.canvas.width - 70, 40) 
    }

    drawRemainingAir() {
        this.ctx.font = "bold 18px arial"
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(`Air: ${this.remainingAir}`, this.canvas.width - 350, 40)
        if (this.remainingAir < 10) {
            this.ctx.font = "bold 90px arial"
            this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            this.ctx.fillText(`Air: ${this.remainingAir}`, 600, this.canvas.height/2)
        }
    }

    winRemainingAir() {
        this.remainingAir += 30
    }

    checkRemainingAir() {
        if (this.remainingAir === 0) {
            this.isGameOver = true;
        }
    }

    winScore(num) {
        this.points += num
    }

    gameOverCallback(callback) {
        this.onGameOver = callback;
    }

    checkAllCollisions() {
        this.diver.checkScreen();
        //SHARKS
        this.sharks.forEach((shark, index) => {
            if (this.diver.checkCollisions(shark)) {
            this.diver.loseLive();
            this.sharks.splice(index, 1);
                if (this.diver.lives === 0) {
                    this.isGameOver = true;
                    this.onGameOver();
                }
            }
        });
        //TREASURE
        this.treasure.forEach((treasure, index) => {
            if (this.diver.checkCollisions(treasure)) {
            this.diver.winLive();
            this.treasure.splice(index, 1);
            }
        });
        //FISHES
        this.fish.forEach((fi, index) => {
            if (this.diver.checkCollisions(fi)) {
            this.winScore(100)
            this.fish.splice(index, 1);
            }
        });
        //AIR
        this.air.forEach((a, index) => {
            if (this.diver.checkCollisions(a)) {
            this.winRemainingAir()
            this.air.splice(index, 1);
                if (this.remainingAir <= 1) {
                    this.isGameOver = true;
                    this.onGameOver(); //no salta a la pantalla de gameOver
                }
            }
        });
    }
    
    
    startLoop() {
        this.diver = new Diver(this.canvas, 1);

        const loop = () => {
        
            if (Math.random() > 0.97) { 
                const y = Math.random() * this.canvas.height;
                this.sharks.push(new Sharks(this.canvas, y));
            }

            if (Math.random() > 0.993 && this.points >= 150 && this.treasure == 0) { 
                const y = Math.random() * this.canvas.height;
                this.treasure.push(new Treasure(this.canvas, y));
            }

            if (Math.random() > 0.99) { 
                const y = Math.random() * this.canvas.height;
                this.fish.push(new Fish(this.canvas, y));
            }

            if (Math.random() > 0.991 && this.air == 0) {  
                const x = Math.random() * this.canvas.width;
                const y = Math.random() * this.canvas.height;
                this.air.push(new Air(this.canvas, x, y));
            }

            if (this.remainingAir < 50) {
                this.ctx.font = "bold 48px arial"
                this.ctx.fillStyle = 'black';
                this.ctx.fillText(`Air: ${this.remainingAir}`, 150 , 150)
            }

            this.checkAllCollisions()
            this.updateCanvas()
            this.clearCanvas()
            this.drawCanvas()
            if (!this.isGameOver) {
                window.requestAnimationFrame(loop)
            }
            
        }
        window.requestAnimationFrame(loop);
    }

}