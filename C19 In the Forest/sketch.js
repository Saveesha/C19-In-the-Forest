PLAY = 1;
var END = 0;
var gameState = PLAY;

var girl, girl_running, girl_dead;
var ground, invisibleGround, groundImage;
var wolf, wolf_running, wolf_pounced
var obstaclesGroup, obstacle1, obstacle2
var backgroundImg
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")
  
  backgroundImg = loadImage("backgroundImg.jpeg");
  
  girl_running = loadAnimation("girl_1.jpg","girl_2.jpg","girl_3.jpg");
  girl_dead = loadAnimation("girl_dead.jpeg");
  
  groundImage = loadImage("ground.jpeg");
  
  wolf_running = loadAnimation("wolf_1.png","wolf_2.png","wolf_3.png");
  wolf_pounced = loadAnimation("wolf_pounced.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  
  gameOverImg = loadImage("gameOver.jpg");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  
  girl = createSprite(50,height-70,20,50);
  
  
  girl.addAnimation("running", girl_running);
  girl.addAnimation("dead", girl_dead);
  girl.setCollider('circle',0,0,350)
  girl.scale = 0.08;
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);

   


    if((touches.length > 0 || keyDown("SPACE")) && girl.y  >= height-120) {
      jumpSound.play( )
      girl.velocityY = -10;
       touches = [];
    }
    
    girl.velocityY = girl.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    girl.collide(invisibleGround);
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(girl)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    
    ground.velocityX = 0;
    girl.velocityX = 0;
    wolf.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    
    girl.changeAnimation("dead",girl_dead);
    wolf.changeAnimation("pounced",wolf_pounced);
    
    obstaclesGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}


function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    
    obstacle.velocityX = -(6 + 3*score/100);
    
    
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
          
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = girl.depth;
    girl.depth +=1;

    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  girl.changeAnimation("running",girl_running);
  
  score = 0;
  
}



