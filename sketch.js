var dog, sadDog, happyDog, database;
var foodS, foodStock;
var addFood;
var foodObj;

//create feed and lastFed variable here
var feed;
var lastFed;


function preload() {
  sadDog = loadImage("Dog.png");
  happyDog = loadImage("happy dog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 400);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  dog = createSprite(800, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;


  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  //create feed the dog button here
  feedTheDog = createButton("FeedTheDog");
  feedTheDog.position(700, 95);
  feedTheDog.mousePressed(feedDog);

}

function draw() {
  background(46, 139, 87);
  foodObj.display();

  //write code to read fedtime value from the database
  database.ref("feedTime").on("value", (data) => {
    lastFed = data.val();
  })


  //write code to display text lastFed time here
  fill("black");
  textSize(24);
  text("last fed at:" + lastFed, 300, 30);

  drawSprites();
}

//function to read food Stock
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog() {
  dog.addImage(happyDog);
  console.log("working");
  // write code here to update food stock and last fed time
  var foodStockVal = foodObj.getFoodStock();
  if (foodStockVal <= 0) {
    foodObj.updateFoodStock(foodStockVal * 0);
  } else {
    foodObj.updateFoodStock(foodStockVal - 1);
  }
  database.ref("/").update({
    food: foodObj.getFoodStock(),
    feedTime: hour()
  })
}

//function to add food in stock
function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}
