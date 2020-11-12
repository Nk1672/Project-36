var dog, happyDog, sadDog;
var dogImg, happyDogImg;
var database;
var foodS, foodStock;
var bedroom, bathroom, garden;

var feedDog;
var addFoods;

var fedTime;
var lastFed;
var foodObj;
var gameState, readState;


function preload(){
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
  bathroom = loadImage("images/Wash Room.png");
  bedroom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  sadDog = loadImage("images/Dog.png")
}

function setup() {
  database = firebase.database();
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  readState=database.ref('gameState')
  readState.on("value",function(data){
    gameState=data.val();
  });
	var canvas = createCanvas(800, 500);
  
   dog = createSprite(width/2,height/2,10,10);
   dog.addImage(dogImg);
   dog.scale = 0.12;

   foodObj = new Food();

   food = new Food();

   feed=createButton("Feed the dog");
   feed.position(700,95);
   feed.mousePressed(feedDog);

   addFood=createButton("Add Food"); 
   addFood.position(800,95);
   addFood.mousePressed(addFoods);
}


function draw() {  
  // background(46,139,87);

  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
      update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
      update("Bathing");
      foodObj.bathroom();
   }else{
      update("Hungry");
      foodObj.display();
   }
    
    if(gameState!="Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
    }else{
     feed.show();
     addFood.show();
     dog.addImage(sadDog);
    }

    drawSprites();

  

  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed : " + lastFed%12+ "PM",350,30);
  } else if(lastFed==0){
    text("Last Fed : 12AM",350,350);
  } else{
    text("Last Fed :" + lastFed+"AM",350,30);
  }
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

/* function writeStock(x){
  if(x<= 0){
    x=0;
  }else {
    x=x-1;
  }
  database.ref('/').update({
    Food:x
  });
} */

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  });
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}

