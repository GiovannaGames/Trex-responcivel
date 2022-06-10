var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  fimdejogo = loadImage("gameOver.png")
reiniciar = loadImage ("restart.png")
jumpsound = loadSound ("jump.mp3")
checkpoint = loadSound("checkpoint.mp3")
die = loadSound("die.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(200,height-70,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  invisibleGround = createSprite(200,height-60,400,10);
  invisibleGround.visible = false;
  
  //crie Grupos de Obstáculos e Nuvens
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  trex.setCollider ("circle",0,0,30)
  trex.debug = false
  gameOver = createSprite(width/2,height/2)
  gameOver.addImage(fimdejogo)
  gameOver.scale = 2
  restart = createSprite (width/2,height/2+40)
  restart.addImage(reiniciar)
  restart.scale = 0.5
  console.log("Hello" + 5);
  
  score = 0;
}

function draw() { 
  background(180);
  text("Score: "+ score, width/2,50);
  
  if(gameState === PLAY){
    gameOver.visible=false
    restart.visible=false
    //mover o solo
    ground.velocityX = -(4+3*score/100);
    score = score + Math.round(frameRate()/60);
    if(score > 0 && score %100===0){
      checkpoint.play()
    }
    if ((touches.length > 0 || keyDown('space')) && trex.y >= height - 40) {
      trex.velocityY = -13;
      jumpsound.play() 
      touches=[]
    }
    
    trex.velocityY = trex.velocityY + 0.8
  
    spawnClouds();
  
    spawnObstacles();
    if(obstaclesGroup.isTouching(trex)) {
      die.play()
      gameState =  END}                                   
   
  }
  else if(gameState === END){
    //parar o solo
    ground.velocityX = 0;
   obstaclesGroup.setVelocityXEach(0)
   cloudsGroup.setVelocityXEach(0)
   trex.velocityY = 0
   obstaclesGroup.setLifetimeEach(-1)
   cloudsGroup.setLifetimeEach(-1)
   trex.changeAnimation("collided",trex_collided)
   gameOver.visible=true
   restart.visible=true
  }
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  trex.collide(invisibleGround);
  
  //gere as nuvens
  if(touches.length > 0 || mousePressedOver(restart)){
 reset() 
 touches=[]
  }
  
  drawSprites();
}
function reset(){
  gameState = PLAY  
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  trex.changeAnimation("running", trex_running)
  score=0
}
function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-70,10,40);
   obstacle.velocityX = -(6+3*score/100);

   
    // //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir escala e vida útil ao obstáculo          
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
     cloud = createSprite(width,height/2,40,10);
    cloud.y = Math.round(random(80,160));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(3+3*score/100);

    
     //atribuir vida útil à variável
    cloud.lifetime = 134;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvem ao grupo
   cloudsGroup.add(cloud);
  }
  
}
