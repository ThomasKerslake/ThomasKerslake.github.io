// Thomas Kerslake - Data visualization - Assignment 2.

// Creating an empty Array called 'OrbArray'
var OrbArray = [];

// Variables to hold sections of the API link to open options for modifactions.
var api = 'http://api.population.io:80/1.0/life-expectancy/remaining/';
var sex = 'male';
var date = '1987';
var country = 'Germany';
var age = '32'
var data;

//Variables for the button input
let getInput = 17; //current button state
let getInputCheck = 0; //check for the switch
let input;

// Creating variables to hold data from the API
let getCountry;
let getLifeExpectancy;
let getDOB;
let getSex;
// Setting up the canvas for the creative code to be displayed on.
function setup() {
  var canvas = createCanvas(1240, 720);


  background(194, 200, 209);
  canvas.class("myCanvas"); //Linking canvas to HTML page
  canvas.parent("myContainer");
  loadAPI(getInput); // Calling my function to load the data from the API

// Setting the variables to be strings
  getCountry = "";
  getLifeExpectancy = "";
  getDOB = "";
  getSex = "";
  getAge = "";

}

// My function to connect and load data from the api with specific values
function loadAPI(theUserAge) {
  loadJSON(api + sex + "/" + country + "/" + date + "-01-01" + "/" + theUserAge + "y/", getData); //Loading the API with a specific query.
}

// Call back function to allow reference to the API
function getData(dataCallback){
  data = dataCallback;

// Setting the values for my strings to hold (with data from the API)
  getCountry = data.country;
  getLifeExpectancy = round(data.remaining_life_expectancy);
  getDOB = data.date;
  getSex = data.sex;
  getAge = data.age;

  // Creating a variable to hold the value of 'remaining_life_expectancy' (this value will then be used in the for loop bellow)
  var rleData = round(data.remaining_life_expectancy);
  // Setting up a for loop to create a number of 'Orbs' equal to the value of 'rleData'.
  for (let v=0; v<rleData; v++){
    // Setting the array 'OrbArray' to hold the generated 'Orbs'.
    OrbArray[v] = new Orb(width/2, height/2, random(-3, 3), random(-3, 3), random(15));
  }
}

//Draw function
function draw() {
  background(194, 200, 209);

  //Interface elements to get data in sketch
  input = select('#userAge');
  getInput = input.value();

  //This is a switch to check new changes and call the API with the new changes
  if(getInputCheck != getInput){ //Check if new data are different from previous - if yes call the API
    loadAPI(getInput); //Call the API with the new parameter (new user input)
    getInputCheck = getInput;
  } //ensure that the switch is updated with the new user input (so that we don't repeat in next draw loop)

  drawInfo();//Function callled to display information to the user
  // Setting up a loop to run untill equal the total entries (length) in the 'OrbArray'
  for (let v=0; v<OrbArray.length; v++){
    // The for loop will push out new 'Orbs' from the array that follow the connected functions.
    OrbArray[v].moveOrbFunction();
    OrbArray[v].drawOrbFunction();
  }
}

// Function that holds data to be displayed to the user
function drawInfo(){
  push();// The start of the 'expand' animation
  translate(width / 2, height / 2);
  var scaleValue = 0.5;
  var theMaximum = 20;
  if (frameCount < theMaximum) {
    var currentScale = map(frameCount, 0, theMaximum, 0, scaleValue);
    scale(1.5 + currentScale);
  }
  else {
    scale(1.5 + scaleValue);
  }// End of the 'expand' animation code.

  // Header and footer on canvas.
  noStroke();
  fill(0, 200);
  rect(-350,-190, 700, 50);
  rect(-350,140, 700, 50);

  // Center box / lines on cavas.
  noFill();
  stroke(1);
  rect(-350,-30, 700, 50);

  // Grabing and displaying data on header / footer / center.
  fill(0);
  noStroke();
  textFont('Arial');
  textSize(35);
  fill(255);
  text(getCountry.toUpperCase(), -90, 8); // Displaying the country in the center of the canvas
  textSize(14);
  text("RLE: " + getLifeExpectancy + " YEARS",-300, 165); // Remaining life expectancy
  text("AGE: " + getAge, -300, -157); // Age
  text("DOB: " + getDOB, 195, -157); // Date of birth
  text("SEX: " + getSex.toUpperCase(), 225, 165); // Sex (male / female)
  pop();
}

// Global function I have used to check a specific key (if its been pressed).
function keyPressed(){
  if(keyCode === RIGHT_ARROW){ // Checking for the 'RIGHT_ARROW' key.
  cleanUp = true;
}
return false; // Used to stop default behaviour
}

// Global function I have used to check a specific key (if its been released).
function keyReleased(){
  if(keyCode === RIGHT_ARROW){ // Checking for is the 'RIGHT_ARROW' key.
  cleanUp = false; // Oposite for key being pressed.
}
return false; // Used to stop default behaviour
}


// The creation of my 'Orb' class
class Orb{
  // Constructor to give my 'Orb' (object) functions.
  constructor(x1, y1, speedX, speedY, size){ //Arguments for the method (constructor)
    // The Orb class' variables
    this.speedX = speedX;
    this.speedY = speedY;
    this.x1 = x1;
    this.y1 = y1;
    //Random value selection to be used in a fill() function to colour 'Orbs'.
    this.colValue = random(255);
    //Size and value for the opacity of each 'Orb'
    this.Alpha = random(100,255);
    this.size = size;
  }



  // Function for movement of the 'Orbs' / collision with the sides of the selected area
  moveOrbFunction(){
    // Movement for the Orbs ('x' location / 'y' location has the value of speedX/Y added to move orbs on the canvas)
    this.x1 = this.x1 + this.speedX;
    this.y1 = this.y1 + this.speedY;
    // Checks if key 'LEFT_ARROW' is being pressed, if so, swap the X / Y speeds with one another.
    if(keyIsDown(LEFT_ARROW)){
      this.speedX = this.speedY;
      this.speedY = this.speedX;
    }
    // Checking if key 'UP_ARROW' is being pressed, if so, add '1' to speed values of speedX/Y every press.
    else if(keyIsDown(UP_ARROW)){
      this.speedX = this.speedX +1;
      this.speedY = this.speedY +1;
    }
    // Checks if the key 'DOWN_ARROW' is being pressed, if so, set values speedX/Y to a value within the original selection (-3,3).
    else if(keyIsDown(DOWN_ARROW)){
      this.speedX =  -3;
      this.speedY =  2;
    }
    // Checking if position of x1 is greater than the canvas width and if also is less than 0.
    if (this.x1 > width || this.x1 < 0){
      this.speedX *= -1; // If either conditions met, change the value of 'speedX'to equal that of speedX * -1
    }// *Reverses direction*
    // Checking if position of y1 is greater than 625 and if also is less than 90.
    if (this.y1 > 625 || this.y1 < 90){
      this.speedY *= -1;//If either conditions met, change the value of 'speedY' to equal that of speedY * -1
    }// *Reverses direction*
  }



  // Function to displays the Orbs and their reflected partners (4)
  drawOrbFunction(){
    // Pre set variables fill this.fillcolour
    this.fillcolour = color(this.colValue, this.colValue, this.colValue, this.Alpha);
    fill(this.fillcolour);// Fills a Orb with the a random colour (from black to white).
    stroke(this.fillcolour);// Fills the stroke with same colour as above.

    // Creates a new operator. Maps to the value of x1 with a range of 0 to width to width to 0.
    this.x2 = map(this.x1, 0, width, width, 0);
    // Creates a new operator. Maps to the value of y1 with a range of 0 to height to height to 0.
    this.y2 = map(this.y1, 0, height, height, 0);

    // The Orbs and their reflections.
    ellipse(this.x1, this.y1, this.size, this.size);
    ellipse(this.x2, this.y2, this.size, this.size);
    ellipse(this.x2, this.y1, this.size, this.size);
    ellipse(this.x1, this.y2, this.size, this.size);

  }
}//End of all code
