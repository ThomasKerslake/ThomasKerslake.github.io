//Creating the Array called 'lineArray'
var lineArray = [];
//Setting the size of the array to 10
var arraySize = 10;
//Setting up the boolean for my area detection
var clickArea;
//Setting up the boolean for my clear canvas function
var cleanUp = false;


//Setting up the canvas for the creative code to be displayed on
function setup() {
var canvas = createCanvas(594, 841);
    background(231,255,255);
    canvas.class("myCanvas");
    canvas.parent("myContainer");
//Sets up a loop to create a new line for the size of the array (10) 
for (let z=0; z<arraySize; z++){
//Sets the array, 'lineArray', to be equal to (hold) the value of 'i'
lineArray[z] = new Line(297, 420, random(-4, 4), random(-4, 4), 320);
            }
}

//Setting up the draw function
function draw() {
    
//This is checking the mouses position for both the x/y cords to see it its within the
//area I have limited it to (x of 0 to 594, and y of 0 to 841)
if(mouseX >= 0 && mouseX <= 0+594 && mouseY >= 0 && mouseY <= 0+841){
    clickArea = true;
} 
else{
   clickArea = false;
}

//Checking if 'clickArea' is equal to true, then if 'cleanUp' is equal to true.
//If both are true then it will continuously update the background colour with the
//set colour, creating this effect of clearing all previous lines that have been drawn.
if(clickArea == true){ //This has been set so the user can only 'clearUp' if their mouse is over the canvas.
   if(cleanUp == true){   
       background(231,255,255);            //** See lines '52' to '64' for the related functions**
   }
}

    
//Sets up a loop to display equal to the number of 'units' in the string in 'lineArray'
  for (let z=0; z<lineArray.length; z++){
//Makes the array adhere to both the functions, 'moveLineFunction' and 'drawLineFunction'
    lineArray[z].moveLineFunction();
    lineArray[z].drawLineFunction();
  }
}

//This function is used to check if a specific key has been pressed
function keyPressed(){
    if(keyCode === RIGHT_ARROW){ //Checking for is the 'RIGHT_ARROW' key is being pressed down.
    cleanUp = true;
    }
    return false; //Used to stop default behaviour  
}

function keyReleased(){
    if(keyCode === RIGHT_ARROW){ //Checking for is the 'RIGHT_ARROW' key has been released.
    cleanUp = false; //Oposite for if the key is being pressed.
    }
    return false; //Used to stop default behaviour  
}


//The setup for my line class
class Line{

//Setting up a constructor to give my 'Line' (object) functions 
constructor(x1, y1, speedX, speedY, size){ //Arguments for the method (constructor)
    //Setup of the line class' variables
    // 'this.' is used as they refer directly to the object, also it allows them to be used within other functions (public).
    this.speedX = speedX;
    this.speedY = speedY;
    this.x1 = x1;
    this.y1 = y1;

    //Setting up the random value selection to be used in a fill() function. 
    this.Red = random(255);
    this.Green = random(255);
    this.Blue = random(255);
    
    //Setting up the size and the value for the opacity of each line (255 = full)
    this.Alpha = 255;
    this.size = size;
  }

  //A function that takes care of movement of the lines and collision with the sides of the canvas
moveLineFunction(){
    //Setting up the movement for the lines (x location and y location will have the value of speedX/Y added to create movement)
    this.x1 = this.x1 + this.speedX;
    this.y1 = this.y1 + this.speedY;
    
    //This checks to see if the key 'LEFT_ARROW' is being pressed down, if so, swap the X / Y speeds with one another
    if(keyIsDown(LEFT_ARROW)){
    this.speedX = this.speedY;
    this.speedY = this.speedX;
    }
    
    //This is checking to see if the key 'UP_ARROW' is being pressed down, if so, add '1' to the speed values of speedX/Y for each press.
    else if(keyIsDown(UP_ARROW)){
    this.speedX = this.speedX +1;
    this.speedY = this.speedY +1;
    }
    
    //This checks to see if the key 'DOWN_ARROW' is being pressed, if so, set the values speedX/Y to a value within the original selection (-4,4).
    else if(keyIsDown(DOWN_ARROW)){
    this.speedX =  3;
    this.speedY =  -2;
    }

    //This checks to see if the position of x1 is greater than the canvas width and if it also is less than 0. 
    if (this.x1 > width || this.x1 < 0){
      this.speedX *= -1; //If either of these conditions are met it will change the value of 'speedX'to equal that of speedX * -1
    }//**Reverses the direction**
    
    //This checks to see if the position of y1 is greater than the canvas height and if it also is less than 0. 
    if (this.y1 > (height) || this.y1 < 0){
      this.speedY *= -1;//If either of these conditions are met it will change the value of 'speedY' to equal that of speedY * -1
    }//**Reverses the direction**
  }

  //Class function that displays the lines and their reflected partner
drawLineFunction(){
    //Using the pre set variables (this.) from the constructor, this.fillcolour will equal to the random values of this.Green/Red/Blue/Alpha
    this.fillcolour = color(this.Red, this.Green, this.Blue, this.Alpha);
    fill(this.fillcolour);//This then fills a line with the a random colour 
    stroke(this.fillcolour);//This then fills a lines stroke with the a random colour 
    
    //This creates a new operator (this.x2) and maps it to the value of x1 with a range of 0 to width to width to 0.
    this.x2 = map(this.x1, 0, width, width, 0);
    //This creates a new operator (this.y2) and maps it to the value of y1 with a range of 0 to height to height to 0.
    this.y2 = map(this.y1, 0, height, height, 0);
    
    //this is creating the lines and their partners to refelect
    line(this.x1, this.y1, this.size, this.size);
    line(this.x2, this.y2, this.size, this.size);
    line(this.x2, this.y1, this.size, this.size);
    line(this.x1, this.y2, this.size, this.size);
    
  }
}
