window.addEventListener('load', function(){
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 720;
  let enemies = []
  class InputHandler {
    constructor(){
      this.keys = [];
      
      window.addEventListener('keydown', e => {
        if((  e.key === 's' ||
              e.key === 'w' ||
              e.key === 'a' ||
              e.key === 'd')
              && this.keys.indexOf(e.key) === -1 ){
          this.keys.push(e.key)
        }
      });
      window.addEventListener('keyup', e => {
        if((  e.key === 's'||
              e.key === 'w' ||
              e.key === 'a' ||
              e.key === 'd')){
          this.keys.splice(this.keys.indexOf(e.key), 1)
        }
      });
    }
  }

  class Player {
    constructor(gameWidth, gameHeight){
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 200;
      this.height = 200;
      this.x = 0;
      this.y = this.gameHeight - this.height;
      this.image = document.getElementById('playerImage');
      this.frameX = 0;
      this.frameY = 0;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
    }

    draw(context){
      context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height)
    }

    update(input){
      
      // horizontal movement
      if (input.keys.indexOf('d') > -1){
        this.speed = 5;
      } else if (input.keys.indexOf('a') > -1) {
        this.speed = -5;
      }  else {
        this.speed = 0;
      }
      this.x+= this.speed;
      if(this.x < 0){
        this.x = 0;
      } else if (this.x > this.gameWidth - this.width) {
        this.x = this.gameWidth - this.width;
      }

      // vertical movement
      if (input.keys.indexOf('w') > -1 && this.onGround()) {
        this.vy -= 32;
      }
      this.y += this.vy;
      if(!this.onGround()){
        this.vy += this.weight;
        this.frameY = 1;
      } else {
        this.vy=0;
        this.frameY = 0;
      }
      if(this.y > this.gameHeight - this.height){
        this.y=this.gameHeight-this.height
      }
    }
    
    onGround(){
      return this.y >= this.gameHeight - this.height;
    }
  }

  class Background {
    constructor(gameWidth, gameHeight){
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = document.getElementById('backgroundImage');
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      this.speed = 1;
    }
    draw(context){
      context.drawImage(this.image, this.x,this.y, this.width, this.height);
      context.drawImage(this.image, this.x + this.width - this.speed,this.y, this.width, this.height);
    }
    update(){
      this.x -= this.speed;
      if (this.x < 0 - this.width){this.x = 0;}
    }
  }

  class Enemy {
    constructor(gameWidth, gameHeight){
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.image=document.getElementById('enemyImage');
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.maxFrame = 5;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000/this.fps;
      this.speed = 4;
    }
    draw(context){
      context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
    }
    update(deltaTime){
      if(this.frameTimer > this.frameInterval){
        console.log('frametimer')
        if (this.frameX >= this.maxFrame){
          this.frameX = 0
        } else {
          this.frameX++
        }
        this.frameTimer = 0
      } else {
        this.frameTimer += deltaTime
      }
      
      this.x -= this.speed;
    }
  }

 
  function handleEnemies(deltaTime){
    if(enemyTimer > enemyInterval + randomEnemyInterval){
      enemies.push(new Enemy(canvas.width, canvas.height))
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }
    enemies.forEach(enemy=>{
      enemy.draw(ctx)
      enemy.update(deltaTime);
    })
  }

  function displayStatusText() {

  }

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.width, canvas.height)
  const enemy1 = new Enemy(canvas.width, canvas.height);
  

  let lastTime = 0;
  let enemyTimer = 0;
  let enemyInterval = 2000;
  let randomEnemyInterval = Math.random() * 2000 + 500;

  function animate(timestamp) {
    const deltaTime = timestamp - lastTime
    lastTime = timestamp;
    ctx.clearRect(0,0,canvas.width, canvas.height)
    background.draw(ctx);
    //background.update();
    player.draw(ctx);
    player.update(input);
    handleEnemies(deltaTime)
    requestAnimationFrame(animate);
  }
  animate(0);
})