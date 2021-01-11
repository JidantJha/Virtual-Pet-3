var dog,happyDog,hungryDog,food,foodStockRef;
var frameCountNow=0
var feed,addfood;
var feedTime,lastFeed,FoodObj,currentTime;
var milk,input,name;
var gameState="hungry";
var gameStateRef;
var bedroomImage,gardenImage,washroomImage,sleepImage,runImage;
var input,button

function preload()
{
  hungryDog=loadImage("HungryDog.png");
  happyDog=loadImage("HappyDog.png");
  bedroomImage=loadImage("BedRoom.png");
  gardenImage=loadImage("Garden.png");
  washroomImage=loadImage("WashRoom.png");
  sleepImage=loadImage("Lazy.png");
  runImage=loadImage("Running.png");
}
function setup() {
  createCanvas(1200,500);
  database=firebase.database();
  
  foodObj=new Food();

  dog=createSprite(width/2+250,height/2,10,10);
  dog.addAnimation("hungry",hungryDog);
  dog.addAnimation("happy",happyDog);
  dog.addAnimation("sleeping",sleepImage);
  dog.addAnimation("run",runImage);
  dog.scale=0.3;

  getGameState();

  feed=createButton("Feed The Dog");
  feed.position(950,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(1050,95);
  addFood.mousePressed(addfood);

  input=createInput("Pet Name");
  input.position(950,120);

  button=createButton("Confirm");
  button.position(1000,145);
  button.mousePressed(createName);

}

function draw() {  
  currentTime=hour();

  if(currentTime===lastFeed+1){
    gameState="playing";
    updateGameState();
    foodObj.garden();
  }
  else if(currentTime===lastFeed+2){
    gameState="sleeping"
    updateGameState();
    foodObj.bedroom();
  }
  else if(currentTime>lastFeed+2 && currentTime<=lastFeed+4){
    gameState="bathing"
    updateGameState();
    foodObj.washroom();
  }
  else{
    gameState="hungry"
    updateGameState();
    foodObj.display();
  }

 FoodObj.getFoodStock();
 //console.log(foodStock);
 getGameState();

 feedTime=database.ref('feedTime');
 feedTime.on("value",function(data){
   lastfeed=data.val();
 })
 if(gameState==="hungry"){
   feed.show();
   addFood.show();
   dog.addAnimation("hungry",hungryDog);
 }
else{
  feed.hide();
  addFood.hide();
  dog.remove();
}

drawSprites();
    textSize(32);
    fill("red");
    textSize(20);
    text("Last Feed:"+lastfeed+":00",300,95);
    text("Time since last feed:"+(currentTime-lastFeed),300,125)
}
    
function feedDog(){
  foodObj.deductFood();
  foodObj.updateFoodStock();
  dog.changeAnimation("happy",happyDog);
  gameState="happy"
  updateGameState();
}

function addFood(){
  foodObj.addFood();
  foodObj.updateFoodStock();
}

async function hour(){
  var site=await fetch()
  var siteJSON=await site.json();
  var datetime=siteJSON.datetime;
  var hourtime=datetime.slice(11,13);
  return hourtime;

}

function createName(){
  input.hide();
  button.hide();

  name=input.value();
  var greeting=createElement('h3');
  greeting.html("Pet's name:",+name);
  